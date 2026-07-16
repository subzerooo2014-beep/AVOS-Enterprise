import { Injectable } from "@nestjs/common";
import { NervousWorkflowHealthIndex } from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousWorkflowRegistryService } from "../registry/nervous-workflow-registry.service";
import { NervousWorkflowTriggerService } from "../triggers/nervous-workflow-trigger.service";
import { NervousWorkflowRuntimeService } from "../runtime/nervous-workflow-runtime.service";
import { NervousWorkflowStateService } from "../state/nervous-workflow-state.service";
import { NervousSagaService } from "../saga/nervous-saga.service";
import { NervousCompensationService } from "../compensation/nervous-compensation.service";
import { NervousWorkflowApprovalService } from "../approval/nervous-workflow-approval.service";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousWorkflowHealthService {
  private readonly indexes =
    new Map<string, NervousWorkflowHealthIndex>();

  constructor(
    private readonly workflows: NervousWorkflowRegistryService,
    private readonly triggers: NervousWorkflowTriggerService,
    private readonly runtime: NervousWorkflowRuntimeService,
    private readonly states: NervousWorkflowStateService,
    private readonly sagas: NervousSagaService,
    private readonly compensation: NervousCompensationService,
    private readonly approvals: NervousWorkflowApprovalService,
    private readonly audit: NervousWorkflowAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const workflows = this.workflows.summary();
    const triggers = this.triggers.summary();
    const runtime = this.runtime.summary();
    const states = this.states.summary();
    const sagas = this.sagas.summary();
    const compensation = this.compensation.summary();
    const approvals = this.approvals.summary();

    const registryScore =
      workflows.total >= 1 &&
      workflows.active >= 1
        ? 100
        : 70;

    const triggerScore =
      triggers.total >= 1 &&
      triggers.active === triggers.total
        ? 100
        : 70;

    const executionScore =
      runtime.total === 0
        ? 100
        : Number(
            (
              runtime.completed /
              runtime.total *
              100
            ).toFixed(2)
          );

    const stateScore =
      states.failures === 0
        ? 100
        : Math.max(0, 100 - states.failures * 20);

    const sagaScore =
      sagas.failed === 0
        ? 100
        : Math.max(0, 100 - sagas.failed * 25);

    const compensationScore =
      compensation.failed === 0
        ? 100
        : Math.max(0, 100 - compensation.failed * 25);

    const approvalScore =
      approvals.total === 0
        ? 100
        : Number(
            (
              approvals.approved /
              approvals.total *
              100
            ).toFixed(2)
          );

    const score = Number(
      (
        registryScore * 0.15 +
        triggerScore * 0.1 +
        executionScore * 0.25 +
        stateScore * 0.1 +
        sagaScore * 0.15 +
        compensationScore * 0.15 +
        approvalScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (registryScore < 90) {
      reasons.push("Workflow registry coverage is incomplete.");
    }

    if (triggerScore < 90) {
      reasons.push("Workflow trigger coverage is incomplete.");
    }

    if (executionScore < 90) {
      reasons.push("Workflow execution success is below target.");
    }

    if (stateScore < 90) {
      reasons.push("Workflow state transitions contain failures.");
    }

    if (sagaScore < 90) {
      reasons.push("Saga executions contain failures.");
    }

    if (compensationScore < 90) {
      reasons.push("Compensation executions contain failures.");
    }

    if (approvalScore < 90) {
      reasons.push("Workflow approval gates remain unresolved.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System workflow core is healthy."
      );
    }

    const index: NervousWorkflowHealthIndex = {
      id: `nervous-workflow-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        registryScore,
        triggerScore,
        executionScore,
        stateScore,
        sagaScore,
        compensationScore,
        approvalScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "nervous-workflow-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): NervousWorkflowHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
