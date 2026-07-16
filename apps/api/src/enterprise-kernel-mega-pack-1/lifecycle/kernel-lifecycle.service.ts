import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import {
  KernelLifecycleAction,
  KernelLifecycleStage,
  KernelLifecycleTransition,
  KernelModuleRecord
} from "../enterprise-kernel-mega-pack-1.types";
import { KernelModuleRegistryService } from "../modules/kernel-module-registry.service";
import { KernelStateService } from "../state/kernel-state.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelLifecycleService {
  private readonly transitions:
    KernelLifecycleTransition[] = [];

  constructor(
    private readonly registry: KernelModuleRegistryService,
    private readonly state: KernelStateService,
    private readonly audit: KernelAuditService
  ) {}

  listTransitions() {
    return [...this.transitions];
  }

  history(moduleId: string) {
    this.registry.get(moduleId);

    return this.transitions.filter(
      (transition) =>
        transition.moduleId === moduleId
    );
  }

  execute(input: {
    moduleId: string;
    action: KernelLifecycleAction;
    actorIdentityId: string;
    correlationId: string;
    reason?: string;
    details?: Record<string, unknown>;
  }) {
    const current = this.registry.get(
      input.moduleId
    );

    const nextStage = this.resolveNextStage(
      current.stage,
      input.action
    );

    this.validateDependencies(
      current,
      input.action
    );

    const now = new Date().toISOString();

    const updated: KernelModuleRecord = {
      ...current,
      stage: nextStage,
      installedAt:
        input.action === "install"
          ? now
          : current.installedAt,
      initializedAt:
        input.action === "initialize"
          ? now
          : current.initializedAt,
      activatedAt:
        input.action === "activate" ||
        input.action === "resume" ||
        input.action === "recover"
          ? now
          : current.activatedAt,
      suspendedAt:
        input.action === "suspend"
          ? now
          : current.suspendedAt,
      deactivatedAt:
        input.action === "deactivate"
          ? now
          : current.deactivatedAt,
      removedAt:
        input.action === "remove"
          ? now
          : current.removedAt,
      lastTransitionAt: now,
      transitionCount:
        current.transitionCount + 1,
      failureReason:
        input.action === "fail"
          ? input.reason ?? "Unknown module failure."
          : input.action === "recover"
            ? undefined
            : current.failureReason,
      metadata: {
        ...current.metadata,
        ...(input.details ?? {})
      }
    };

    this.registry.save(updated);
    this.syncRuntimeState(updated);

    const transition: KernelLifecycleTransition = {
      id: `kernel-lifecycle-transition:${Date.now()}:${
        this.transitions.length + 1
      }`,
      moduleId: current.id,
      action: input.action,
      fromStage: current.stage,
      toStage: nextStage,
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId,
      reason:
        input.reason ??
        `Kernel lifecycle action ${input.action}.`,
      successful: true,
      details: input.details ?? {},
      occurredAt: now
    };

    this.transitions.push(transition);

    this.audit.record({
      correlationId: input.correlationId,
      category: "lifecycle",
      action: `kernel-module-${input.action}`,
      subjectId: current.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        input.action === "fail"
          ? "failure"
          : "success",
      metadata: {
        fromStage: current.stage,
        toStage: nextStage
      }
    });

    if (
      input.action === "remove" &&
      current.manifest.removable
    ) {
      this.registry.remove(current.id);
    }

    return {
      module: updated,
      transition
    };
  }

  bootstrapModule(input: {
    moduleId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    let current = this.registry.get(
      input.moduleId
    );

    const actions: KernelLifecycleAction[] = [];

    if (current.stage === "registered") {
      actions.push("install");
    }

    current = this.registry.get(input.moduleId);

    if (
      current.stage === "registered" ||
      current.stage === "installed"
    ) {
      actions.push("initialize");
    }

    current = this.registry.get(input.moduleId);

    if (
      current.stage !== "active" &&
      current.stage !== "suspended"
    ) {
      actions.push("activate");
    }

    const results = [];

    for (const action of actions) {
      results.push(
        this.execute({
          moduleId: input.moduleId,
          action,
          actorIdentityId:
            input.actorIdentityId,
          correlationId: input.correlationId,
          reason: "Kernel automatic bootstrap."
        })
      );
    }

    return {
      moduleId: input.moduleId,
      actions,
      results,
      finalModule: this.registry.get(
        input.moduleId
      )
    };
  }

  bootstrapAutoModules(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const candidates = this.registry
      .list()
      .filter(
        (module) =>
          module.manifest.autoActivate &&
          module.stage !== "active"
      );

    const ordered = this.activationOrder(
      candidates.map((module) => module.id)
    );

    const results = ordered.map((moduleId) =>
      this.bootstrapModule({
        moduleId,
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      })
    );

    return {
      requested: candidates.length,
      activationOrder: ordered,
      activated: results.length,
      results
    };
  }

  activationOrder(moduleIds?: string[]) {
    const modules = this.registry.list();
    const selected = new Set(
      moduleIds ?? modules.map((module) => module.id)
    );
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const ordered: string[] = [];

    const visit = (id: string) => {
      if (visited.has(id)) {
        return;
      }

      if (visiting.has(id)) {
        throw new BadRequestException(
          `Kernel module dependency cycle detected at ${id}.`
        );
      }

      visiting.add(id);

      const module = this.registry.get(id);

      for (const dependencyId of module.manifest.dependencies) {
        if (selected.has(dependencyId)) {
          visit(dependencyId);
        }
      }

      visiting.delete(id);
      visited.add(id);
      ordered.push(id);
    };

    for (const id of selected) {
      visit(id);
    }

    return ordered;
  }

  summary() {
    return {
      totalTransitions: this.transitions.length,
      successful: this.transitions.filter(
        (transition) => transition.successful
      ).length,
      failures: this.transitions.filter(
        (transition) =>
          transition.toStage === "failed"
      ).length,
      activations: this.transitions.filter(
        (transition) =>
          transition.toStage === "active"
      ).length
    };
  }

  private resolveNextStage(
    current: KernelLifecycleStage,
    action: KernelLifecycleAction
  ): KernelLifecycleStage {
    const allowed: Record<
      KernelLifecycleAction,
      KernelLifecycleStage[]
    > = {
      install: ["registered"],
      initialize: ["installed"],
      activate: ["initialized", "inactive"],
      suspend: ["active"],
      resume: ["suspended"],
      deactivate: ["active", "suspended"],
      remove: ["inactive", "failed"],
      fail: [
        "registered",
        "installed",
        "initialized",
        "active",
        "suspended",
        "inactive"
      ],
      recover: ["failed"]
    };

    if (!allowed[action].includes(current)) {
      throw new BadRequestException(
        `Invalid kernel lifecycle transition: ${current} -> ${action}.`
      );
    }

    const targets: Record<
      KernelLifecycleAction,
      KernelLifecycleStage
    > = {
      install: "installed",
      initialize: "initialized",
      activate: "active",
      suspend: "suspended",
      resume: "active",
      deactivate: "inactive",
      remove: "removed",
      fail: "failed",
      recover: "inactive"
    };

    return targets[action];
  }

  private validateDependencies(
    module: KernelModuleRecord,
    action: KernelLifecycleAction
  ) {
    if (
      action !== "initialize" &&
      action !== "activate" &&
      action !== "resume"
    ) {
      return;
    }

    for (const dependencyId of module.manifest.dependencies) {
      const dependency = this.registry.get(
        dependencyId
      );

      const acceptable =
        action === "initialize"
          ? [
              "initialized",
              "active",
              "suspended",
              "inactive"
            ].includes(dependency.stage)
          : dependency.stage === "active";

      if (!acceptable) {
        throw new BadRequestException(
          `Kernel module ${module.id} requires dependency ${dependencyId} in a compatible stage. Current stage: ${dependency.stage}.`
        );
      }
    }
  }

  private syncRuntimeState(
    module: KernelModuleRecord
  ) {
    if (module.stage === "active") {
      this.state.setModuleState({
        moduleId: module.id,
        stage: "active"
      });
      return;
    }

    if (module.stage === "suspended") {
      this.state.setModuleState({
        moduleId: module.id,
        stage: "suspended"
      });
      return;
    }

    if (module.stage === "failed") {
      this.state.setModuleState({
        moduleId: module.id,
        stage: "failed"
      });
      return;
    }

    this.state.setModuleState({
      moduleId: module.id,
      stage:
        module.stage === "removed"
          ? "removed"
          : "inactive"
    });
  }
}
