import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelRecoveryActionType,
  KernelRecoveryPlan,
  KernelRecoveryStep
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelFailureClassifierService } from "../failures/kernel-failure-classifier.service";
import { KernelDiagnosticsService } from "../diagnostics/kernel-diagnostics.service";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelIsolationService } from "../isolation/kernel-isolation.service";
import { KernelOperationalModeService } from "../modes/kernel-operational-mode.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelRecoveryService {
  private readonly plans = new Map<string, KernelRecoveryPlan>();

  constructor(
    private readonly failures: KernelFailureClassifierService,
    private readonly diagnostics: KernelDiagnosticsService,
    private readonly health: KernelHealthRegistryService,
    private readonly isolation: KernelIsolationService,
    private readonly modes: KernelOperationalModeService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.plans.values());
  }

  get(id: string) {
    const plan = this.plans.get(id);

    if (!plan) {
      throw new NotFoundException(`Kernel recovery plan not found: ${id}`);
    }

    return plan;
  }

  create(input: {
    failureId: string;
    createdByIdentityId: string;
    correlationId: string;
  }) {
    const failure = this.failures.get(input.failureId);

    const finding = this.diagnostics.diagnose({
      componentId: failure.componentId,
      actorIdentityId: input.createdByIdentityId,
      correlationId: input.correlationId
    });

    const actions = Array.from(
      new Set<KernelRecoveryActionType>(finding.recommendedActions)
    );

    if (failure.requiresIsolation && !actions.includes("isolate")) {
      actions.unshift("isolate");
    }

    if (failure.requiresHumanApproval && !actions.includes("manual-intervention")) {
      actions.push("manual-intervention");
    }

    const steps: KernelRecoveryStep[] = actions.map((action, index) => ({
      id: `kernel-recovery-step:${Date.now()}:${index + 1}`,
      order: index + 1,
      action,
      description: this.describe(action),
      required: action !== "manual-intervention",
      status: "pending"
    }));

    const plan: KernelRecoveryPlan = {
      id: `kernel-recovery-plan:${Date.now()}:${this.plans.size + 1}`,
      failureId: failure.id,
      componentId: failure.componentId,
      risk:
        failure.severity === "fatal" || failure.severity === "critical"
          ? "critical"
          : failure.severity === "error"
            ? "high"
            : failure.severity === "warning"
              ? "medium"
              : "low",
      requiresHumanApproval: failure.requiresHumanApproval,
      status: "planned",
      steps,
      createdByIdentityId: input.createdByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.plans.set(plan.id, plan);

    this.audit.record({
      correlationId: input.correlationId,
      category: "recovery",
      action: "kernel-recovery-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: plan.requiresHumanApproval ? "warning" : "success",
      metadata: {
        componentId: plan.componentId,
        risk: plan.risk,
        steps: plan.steps.map((step) => step.action)
      }
    });

    return plan;
  }

  approve(input: {
    planId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.planId);

    if (!current.requiresHumanApproval) {
      return current;
    }

    const updated: KernelRecoveryPlan = {
      ...current,
      approvedByIdentityId: input.approvedByIdentityId
    };

    this.plans.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "recovery",
      action: "kernel-recovery-plan-approved",
      subjectId: updated.id,
      actorIdentityId: input.approvedByIdentityId,
      outcome: "success",
      metadata: {}
    });

    return updated;
  }

  execute(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
    humanApprovedSafeMode?: boolean;
  }) {
    const current = this.get(input.planId);

    if (
      current.requiresHumanApproval &&
      !current.approvedByIdentityId
    ) {
      throw new ConflictException(
        "Kernel recovery plan requires human approval."
      );
    }

    const running: KernelRecoveryPlan = {
      ...current,
      status: "running",
      steps: current.steps.map((step) => ({ ...step }))
    };

    this.plans.set(running.id, running);
    this.health.setRecovery(running.componentId, true);

    try {
      for (const step of running.steps.sort((a, b) => a.order - b.order)) {
        step.status = "running";
        step.startedAt = new Date().toISOString();

        try {
          step.result = this.executeStep(
            step.action,
            running.componentId,
            input
          );

          step.status = "completed";
          step.completedAt = new Date().toISOString();
        }
        catch (error) {
          step.status = "failed";
          step.error = error instanceof Error ? error.message : String(error);
          step.completedAt = new Date().toISOString();

          if (step.required) {
            throw error;
          }
        }
      }

      const completed: KernelRecoveryPlan = {
        ...running,
        status: "completed",
        completedAt: new Date().toISOString()
      };

      this.plans.set(completed.id, completed);
      this.health.setRecovery(completed.componentId, false);

      this.health.ingestSignal({
        componentId: completed.componentId,
        status: "healthy",
        score: 100,
        source: "kernel-recovery",
        message: "Kernel recovery plan completed.",
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      });

      this.audit.record({
        correlationId: input.correlationId,
        category: "recovery",
        action: "kernel-recovery-plan-completed",
        subjectId: completed.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          componentId: completed.componentId
        }
      });

      return completed;
    }
    catch (error) {
      const failed: KernelRecoveryPlan = {
        ...running,
        status: "failed",
        completedAt: new Date().toISOString()
      };

      this.plans.set(failed.id, failed);
      this.health.setRecovery(failed.componentId, false);

      this.audit.record({
        correlationId: input.correlationId,
        category: "recovery",
        action: "kernel-recovery-plan-failed",
        subjectId: failed.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "failure",
        metadata: {
          error: error instanceof Error ? error.message : String(error)
        }
      });

      return failed;
    }
  }

  summary() {
    const plans = this.list();

    return {
      total: plans.length,
      planned: plans.filter((x) => x.status === "planned").length,
      running: plans.filter((x) => x.status === "running").length,
      completed: plans.filter((x) => x.status === "completed").length,
      failed: plans.filter((x) => x.status === "failed").length,
      requiringHumanApproval: plans.filter((x) => x.requiresHumanApproval).length
    };
  }

  private executeStep(
    action: KernelRecoveryActionType,
    componentId: string,
    input: {
      actorIdentityId: string;
      correlationId: string;
      humanApprovedSafeMode?: boolean;
    }
  ) {
    switch (action) {
      case "retry":
        return { retried: true };
      case "restart":
        return { restarted: true };
      case "isolate":
        return this.isolation.isolate({
          componentId,
          reason: "Recovery plan isolation.",
          isolatedByIdentityId: input.actorIdentityId,
          correlationId: input.correlationId
        });
      case "restore-config":
        return { configurationRestored: true };
      case "rollback":
        return { rollbackExecuted: true };
      case "degrade":
        return this.modes.transition({
          toMode: "degraded",
          reason: "Recovery plan degraded mode.",
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId,
          humanApproved: false
        });
      case "safe-mode":
        return this.modes.transition({
          toMode: "safe",
          reason: "Recovery plan safe mode.",
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId,
          humanApproved: input.humanApprovedSafeMode ?? false
        });
      case "manual-intervention":
        return { manualInterventionAcknowledged: true };
    }
  }

  private describe(action: KernelRecoveryActionType) {
    const descriptions: Record<KernelRecoveryActionType, string> = {
      retry: "Retry the failed operation.",
      restart: "Restart the affected component.",
      isolate: "Isolate the affected component.",
      "restore-config": "Restore the last known good configuration.",
      rollback: "Rollback the affected change.",
      degrade: "Enter degraded operational mode.",
      "safe-mode": "Enter controlled safe mode.",
      "manual-intervention": "Require manual human intervention."
    };

    return descriptions[action];
  }
}
