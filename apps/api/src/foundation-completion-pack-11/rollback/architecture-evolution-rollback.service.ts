import { Injectable } from "@nestjs/common";
import { EvolutionRollbackRecord } from "../foundation-pack-11.types";
import { ArchitectureEvolutionRequestService } from "../requests/architecture-evolution-request.service";
import { ArchitectureEvolutionPlanService } from "../plans/architecture-evolution-plan.service";
import { ArchitectureEvolutionExecutionService } from "../execution/architecture-evolution-execution.service";
import { EvolutionAuditService } from "../observability/evolution-audit.service";
import { EvolutionHistoryService } from "../history/evolution-history.service";

@Injectable()
export class ArchitectureEvolutionRollbackService {
  private readonly records =
    new Map<string, EvolutionRollbackRecord>();

  constructor(
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly plans: ArchitectureEvolutionPlanService,
    private readonly executions: ArchitectureEvolutionExecutionService,
    private readonly audit: EvolutionAuditService,
    private readonly history: EvolutionHistoryService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  rollback(input: {
    planId: string;
    reason: string;
    executedByIdentityId: string;
  }) {
    const plan = this.plans.get(input.planId);
    const request = this.requests.get(plan.requestId);

    const completedSteps = plan.steps
      .filter((step) => step.status === "completed")
      .reverse();

    const created: EvolutionRollbackRecord[] = [];

    for (const step of completedSteps) {
      const record: EvolutionRollbackRecord = {
        id: `evolution-rollback:${Date.now()}:${
          this.records.size + 1
        }`,
        planId: plan.id,
        stepId: step.id,
        rollbackAction: step.rollbackAction,
        reason: input.reason,
        executedByIdentityId: input.executedByIdentityId,
        status: "completed",
        output: {
          rollbackAction: step.rollbackAction,
          targetAssetId: step.targetAssetId
        },
        executedAt: new Date().toISOString()
      };

      this.records.set(record.id, record);
      created.push(record);

      this.plans.updateStep(
        plan.id,
        step.id,
        { status: "rolled-back" }
      );

      this.audit.record({
        correlationId: request.correlationId,
        category: "rollback",
        action: "evolution-step-rolled-back",
        subjectId: record.id,
        actorIdentityId: input.executedByIdentityId,
        outcome: "success",
        metadata: {
          planId: plan.id,
          stepId: step.id,
          rollbackAction: step.rollbackAction
        }
      });
    }

    this.plans.updateStatus(
      plan.id,
      "rolled-back",
      input.executedByIdentityId
    );

    this.requests.updateStatus(
      request.id,
      "rolled-back",
      input.executedByIdentityId
    );

    this.history.record({
      requestId: request.id,
      planId: plan.id,
      blueprintId: request.blueprintId,
      action: "evolution-rolled-back",
      actorIdentityId: input.executedByIdentityId,
      nextStatus: "rolled-back",
      metadata: {
        reason: input.reason,
        rollbackRecords: created.map(
          (record) => record.id
        ),
        executionSnapshot:
          this.executions.snapshot(plan.id)
      }
    });

    return {
      planId: plan.id,
      requestId: request.id,
      rollbackRecords: created,
      completedAt: new Date().toISOString()
    };
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      completed: records.filter(
        (record) => record.status === "completed"
      ).length,
      failed: records.filter(
        (record) => record.status === "failed"
      ).length
    };
  }
}
