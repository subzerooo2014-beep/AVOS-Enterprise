import { Injectable } from "@nestjs/common";
import {
  FactoryExecutionError,
  FactoryExecutionStage,
  FactoryStageResult,
} from "../contracts/factory.contracts";
import { StateStoreService } from "./state-store.service";

export type FactoryStageHandler = (
  input: Record<string, unknown>,
  context: { executionId: string; stage: FactoryExecutionStage },
) => Promise<Record<string, unknown>> | Record<string, unknown>;

@Injectable()
export class StageRunnerService {
  private readonly handlers = new Map<string, FactoryStageHandler>();

  constructor(private readonly stateStore: StateStoreService) {
    this.registerHandler("passthrough", (input) => ({ ...input }));
    this.registerHandler("metadata", (input, context) => ({
      ...input,
      stageId: context.stage.id,
      processedAt: new Date().toISOString(),
    }));
  }

  registerHandler(name: string, handler: FactoryStageHandler): void {
    this.handlers.set(name, handler);
  }

  listHandlers(): string[] {
    return [...this.handlers.keys()].sort();
  }

  async run(
    executionId: string,
    stage: FactoryExecutionStage,
    input: Record<string, unknown>,
  ): Promise<FactoryStageResult> {
    const startedAtMs = Date.now();
    const startedAt = new Date(startedAtMs).toISOString();
    const handler = this.handlers.get(stage.handler);

    if (!handler) {
      return this.failed(stage, startedAt, startedAtMs, {
        code: "FACTORY_HANDLER_NOT_FOUND",
        message: `No stage handler registered with name '${stage.handler}'.`,
        stageId: stage.id,
      });
    }

    try {
      const output = await this.withTimeout(
        Promise.resolve(handler(input, { executionId, stage })),
        stage.timeoutMs,
      );

      this.stateStore.set(executionId, stage.id, output);
      const completedAtMs = Date.now();

      return {
        stageId: stage.id,
        stageName: stage.name,
        status: "completed",
        startedAt,
        completedAt: new Date(completedAtMs).toISOString(),
        durationMs: completedAtMs - startedAtMs,
        output,
      };
    } catch (error) {
      return this.failed(stage, startedAt, startedAtMs, {
        code: "FACTORY_STAGE_EXECUTION_FAILED",
        message: error instanceof Error ? error.message : String(error),
        stageId: stage.id,
      });
    }
  }

  private failed(
    stage: FactoryExecutionStage,
    startedAt: string,
    startedAtMs: number,
    error: FactoryExecutionError,
  ): FactoryStageResult {
    const completedAtMs = Date.now();
    return {
      stageId: stage.id,
      stageName: stage.name,
      status: "failed",
      startedAt,
      completedAt: new Date(completedAtMs).toISOString(),
      durationMs: completedAtMs - startedAtMs,
      error,
    };
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timeoutHandle: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error(`Stage timed out after ${timeoutMs} ms.`)),
        timeoutMs,
      );
    });

    try {
      return await Promise.race([promise, timeout]);
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
  }
}
