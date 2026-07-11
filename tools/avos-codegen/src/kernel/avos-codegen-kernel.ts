import { randomUUID } from "node:crypto";
import {
  CodeGenEngine,
  CodeGenEventSeverity,
  CodeGenEventType,
  CodeGenKernelSnapshot,
  CodeGenKernelStatus,
  CodeGenRuntimeContext,
} from "../core/codegen.contracts";
import {
  CodeGenKernelStateError,
} from "../core/codegen.errors";
import {
  AVOS_CODEGEN_VERSION,
  formatCodeGenVersion,
} from "../core/codegen-version";
import {
  CodeGenEngineRegistry,
} from "../registry/codegen-engine-registry";
import {
  CodeGenEventBus,
} from "../runtime/codegen-event-bus";

export interface CreateCodeGenContextInput {
  workspaceRoot: string;
  codegenRoot: string;
  environment?: string;
  dryRun?: boolean;
  variables?:
    CodeGenRuntimeContext["variables"];
  metadata?:
    CodeGenRuntimeContext["metadata"];
}

export class AvosCodeGenKernel {
  readonly name =
    "AVOS CodeGen OS";

  readonly version =
    formatCodeGenVersion(
      AVOS_CODEGEN_VERSION,
    );

  private statusValue =
    CodeGenKernelStatus.CREATED;

  private contextValue?:
    CodeGenRuntimeContext;

  private initializedAt?:
    string;

  private startedAt?:
    string;

  private stoppedAt?:
    string;

  private lastError:
    string | undefined;

  constructor(
    readonly registry =
      new CodeGenEngineRegistry(),
    readonly events =
      new CodeGenEventBus(),
  ) {}

  get status():
    CodeGenKernelStatus {
    return this.statusValue;
  }

  get context():
    CodeGenRuntimeContext | undefined {
    return this.contextValue
      ? structuredClone(
          this.contextValue,
        )
      : undefined;
  }

  async initialize(
    input:
      CreateCodeGenContextInput,
  ): Promise<CodeGenRuntimeContext> {
    if (
      ![
        CodeGenKernelStatus.CREATED,
        CodeGenKernelStatus.STOPPED,
        CodeGenKernelStatus.FAILED,
      ].includes(this.statusValue)
    ) {
      throw new CodeGenKernelStateError(
        `Kernel cannot initialize from status ${this.statusValue}`,
      );
    }

    this.statusValue =
      CodeGenKernelStatus.INITIALIZING;

    const now =
      new Date().toISOString();

    const context:
      CodeGenRuntimeContext = {
      executionId:
        randomUUID(),
      workspaceRoot:
        input.workspaceRoot,
      codegenRoot:
        input.codegenRoot,
      environment:
        input.environment ??
        "development",
      dryRun:
        input.dryRun ??
        false,
      startedAt:
        now,
      variables:
        input.variables ?? {},
      metadata:
        input.metadata ?? {},
    };

    this.contextValue =
      context;

    await this.events.emit({
      type:
        CodeGenEventType.KERNEL_INITIALIZING,
      source:
        "avos-codegen-kernel",
      executionId:
        context.executionId,
      payload: {
        version:
          this.version,
        workspaceRoot:
          context.workspaceRoot,
        codegenRoot:
          context.codegenRoot,
        environment:
          context.environment,
        dryRun:
          context.dryRun,
      },
    });

    try {
      for (
        const engine of
        this.resolveEngineOrder()
      ) {
        await engine.initialize?.(
          context,
        );
      }

      this.statusValue =
        CodeGenKernelStatus.READY;

      this.initializedAt =
        new Date().toISOString();

      this.lastError =
        undefined;

      await this.events.emit({
        type:
          CodeGenEventType.KERNEL_READY,
        source:
          "avos-codegen-kernel",
        executionId:
          context.executionId,
        payload: {
          version:
            this.version,
          engines:
            this.registry.count(),
          initializedAt:
            this.initializedAt,
        },
      });

      return structuredClone(
        context,
      );
    } catch (error) {
      await this.fail(error);

      throw error;
    }
  }

  async start():
    Promise<void> {
    const context =
      this.requireContext();

    if (
      this.statusValue !==
      CodeGenKernelStatus.READY
    ) {
      throw new CodeGenKernelStateError(
        `Kernel cannot start from status ${this.statusValue}`,
      );
    }

    this.statusValue =
      CodeGenKernelStatus.RUNNING;

    this.startedAt =
      new Date().toISOString();

    try {
      for (
        const engine of
        this.resolveEngineOrder()
      ) {
        await engine.start?.(
          context,
        );
      }
    } catch (error) {
      await this.fail(error);

      throw error;
    }
  }

  async stop():
    Promise<void> {
    const context =
      this.requireContext();

    if (
      ![
        CodeGenKernelStatus.READY,
        CodeGenKernelStatus.RUNNING,
      ].includes(this.statusValue)
    ) {
      throw new CodeGenKernelStateError(
        `Kernel cannot stop from status ${this.statusValue}`,
      );
    }

    this.statusValue =
      CodeGenKernelStatus.STOPPING;

    await this.events.emit({
      type:
        CodeGenEventType.KERNEL_STOPPING,
      source:
        "avos-codegen-kernel",
      executionId:
        context.executionId,
      payload: {
        engines:
          this.registry.count(),
      },
    });

    const engines =
      [...this.resolveEngineOrder()]
        .reverse();

    for (
      const engine of engines
    ) {
      await engine.stop?.(
        context,
      );
    }

    this.statusValue =
      CodeGenKernelStatus.STOPPED;

    this.stoppedAt =
      new Date().toISOString();

    await this.events.emit({
      type:
        CodeGenEventType.KERNEL_STOPPED,
      source:
        "avos-codegen-kernel",
      executionId:
        context.executionId,
      payload: {
        stoppedAt:
          this.stoppedAt,
      },
    });
  }

  registerEngine(
    engine:
      CodeGenEngine,
    replace =
      false,
  ): CodeGenEngine {
    const previous =
      this.registry.find(
        engine.descriptor.key,
      );

    const registered =
      this.registry.register(
        engine,
        {
          replace,
        },
      );

    void this.events.emit({
      type:
        previous
          ? CodeGenEventType.ENGINE_REPLACED
          : CodeGenEventType.ENGINE_REGISTERED,
      source:
        "avos-codegen-kernel",
      ...(this.contextValue
        ? {
            executionId:
              this.contextValue.executionId,
          }
        : {}),
      payload: {
        key:
          registered.descriptor.key,
        name:
          registered.descriptor.name,
        type:
          registered.descriptor.type,
        enabled:
          registered.descriptor.enabled,
      },
    });

    return registered;
  }

  snapshot():
    CodeGenKernelSnapshot {
    return {
      name:
        this.name,
      version:
        this.version,
      status:
        this.statusValue,
      engines:
        this.registry.count(),
      enabledEngines:
        this.registry
          .listEnabled()
          .length,
      events:
        this.events
          .list()
          .length,
      ...(this.contextValue
        ? {
            executionId:
              this.contextValue
                .executionId,
          }
        : {}),
      ...(this.initializedAt
        ? {
            initializedAt:
              this.initializedAt,
          }
        : {}),
      ...(this.startedAt
        ? {
            startedAt:
              this.startedAt,
          }
        : {}),
      ...(this.stoppedAt
        ? {
            stoppedAt:
              this.stoppedAt,
          }
        : {}),
      ...(this.lastError
        ? {
            lastError:
              this.lastError,
          }
        : {}),
    };
  }

  private resolveEngineOrder():
    readonly CodeGenEngine[] {
    const ordered:
      CodeGenEngine[] = [];

    const visiting =
      new Set<string>();

    const visited =
      new Set<string>();

    const visit = (
      engine:
        CodeGenEngine,
    ): void => {
      const key =
        engine.descriptor.key;

      if (
        visited.has(key)
      ) {
        return;
      }

      if (
        visiting.has(key)
      ) {
        throw new CodeGenKernelStateError(
          `Circular engine dependency detected at ${key}`,
        );
      }

      visiting.add(key);

      for (
        const dependencyKey of
        engine.descriptor
          .dependencies
      ) {
        const dependency =
          this.registry.get(
            dependencyKey,
          );

        visit(dependency);
      }

      visiting.delete(key);
      visited.add(key);

      if (
        engine.descriptor.enabled
      ) {
        ordered.push(engine);
      }
    };

    for (
      const engine of
      this.registry.listEnabled()
    ) {
      visit(engine);
    }

    return ordered;
  }

  private requireContext():
    CodeGenRuntimeContext {
    if (
      !this.contextValue
    ) {
      throw new CodeGenKernelStateError(
        "CodeGen kernel has not been initialized",
      );
    }

    return this.contextValue;
  }

  private async fail(
    error: unknown,
  ): Promise<void> {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown CodeGen kernel failure";

    this.lastError =
      message;

    this.statusValue =
      CodeGenKernelStatus.FAILED;

    await this.events.emit({
      type:
        CodeGenEventType.KERNEL_FAILED,
      severity:
        CodeGenEventSeverity.CRITICAL,
      source:
        "avos-codegen-kernel",
      ...(this.contextValue
        ? {
            executionId:
              this.contextValue.executionId,
          }
        : {}),
      payload: {
        error:
          message,
      },
    });
  }
}

