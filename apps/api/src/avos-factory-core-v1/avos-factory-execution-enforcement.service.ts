import { Injectable } from "@nestjs/common";
import {
  FactoryEnforcedExecutionInput,
  FactoryEnforcedExecutionResult
} from "./avos-factory-enforcement.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryEnforcementMetricsService
} from "./avos-factory-enforcement-metrics.service";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";
import {
  AvosFactoryIdempotencyService
} from "./avos-factory-idempotency.service";
import {
  AvosFactoryLockService
} from "./avos-factory-lock.service";
import {
  ProjectExecutionHistoryService
} from "./project-execution-history.service";
import {
  ProjectExecutionService
} from "./project-execution.service";

@Injectable()
export class AvosFactoryExecutionEnforcementService {
  constructor(
    private readonly execution:
      ProjectExecutionService,
    private readonly governance:
      AvosFactoryGovernanceService,
    private readonly locks:
      AvosFactoryLockService,
    private readonly idempotency:
      AvosFactoryIdempotencyService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly history:
      ProjectExecutionHistoryService,
    private readonly metrics:
      AvosFactoryEnforcementMetricsService
  ) {}

  async execute(
    input: FactoryEnforcedExecutionInput
  ): Promise<FactoryEnforcedExecutionResult> {
    this.metrics.increment("executionsAttempted");

    const existing =
      this.idempotency.get(input.idempotencyKey);

    if (
      existing?.status === "completed" &&
      existing.result
    ) {
      this.metrics.increment("executionsReplayed");

      this.writeAudit({
        category: "execution",
        action: "project-execution-replayed",
        actor: input.actor,
        approvedBy:
          input.options.approvedBy ??
          input.plan.approvedBy,
        success: true,
        correlationId:
          input.options.correlationId,
        resourceId:
          input.plan.projectId,
        details: {
          idempotencyKey:
            input.idempotencyKey
        }
      });

      return {
        replayed: true,
        idempotencyKey:
          input.idempotencyKey,
        result:
          existing.result as FactoryEnforcedExecutionResult["result"]
      };
    }

    const actorExecutionsLastHour =
      this.countActorExecutionsLastHour(
        input.actor
      );

    try {
      this.governance.assertExecutionAllowed({
        actor: input.actor,
        activeExecutions:
          this.locks.countActive(),
        actorExecutionsLastHour
      });
    } catch (error) {
      this.metrics.increment("quotaRejections");

      this.writeAudit({
        category: "governance",
        action: "project-execution-rejected",
        actor: input.actor,
        approvedBy:
          input.options.approvedBy ??
          input.plan.approvedBy,
        success: false,
        correlationId:
          input.options.correlationId,
        resourceId:
          input.plan.projectId,
        details: {
          reason:
            error instanceof Error
              ? error.message
              : String(error)
        }
      });

      throw error;
    }

    const resourceKey =
      `project:${input.plan.projectId}`;

    let lockAcquired = false;

    try {
      this.locks.acquire(
        resourceKey,
        input.actor
      );
      lockAcquired = true;
      this.metrics.increment("locksAcquired");
    } catch (error) {
      this.metrics.increment("lockConflicts");

      this.writeAudit({
        category: "security",
        action: "project-lock-conflict",
        actor: input.actor,
        success: false,
        resourceId:
          input.plan.projectId,
        details: {
          resourceKey,
          reason:
            error instanceof Error
              ? error.message
              : String(error)
        }
      });

      throw error;
    }

    this.idempotency.begin(
      input.idempotencyKey,
      "project-execution",
      input.actor
    );

    this.writeAudit({
      category: "execution",
      action: "project-execution-started",
      actor: input.actor,
      approvedBy:
        input.options.approvedBy ??
        input.plan.approvedBy,
      success: true,
      correlationId:
        input.options.correlationId,
      resourceId:
        input.plan.projectId,
      details: {
        idempotencyKey:
          input.idempotencyKey,
        resourceKey
      }
    });

    try {
      const result =
        await this.execution.execute({
          plan: input.plan,
          options: input.options
        });

      if (!result.success) {
        throw new Error(
          result.error ??
          "Project execution returned failure."
        );
      }

      this.idempotency.complete(
        input.idempotencyKey,
        result
      );

      this.metrics.increment("executionsCompleted");

      this.writeAudit({
        category: "execution",
        action: "project-execution-completed",
        actor: input.actor,
        approvedBy:
          input.options.approvedBy ??
          input.plan.approvedBy,
        success: true,
        correlationId:
          input.options.correlationId,
        resourceId:
          input.plan.projectId,
        details: {
          transactionId:
            result.transactionId,
          targetPath:
            result.targetPath,
          artifactCount:
            result.artifactCount
        }
      });

      return {
        replayed: false,
        idempotencyKey:
          input.idempotencyKey,
        result
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : String(error);

      this.idempotency.fail(
        input.idempotencyKey,
        message
      );

      this.metrics.increment("executionsFailed");

      this.writeAudit({
        category: "execution",
        action: "project-execution-failed",
        actor: input.actor,
        approvedBy:
          input.options.approvedBy ??
          input.plan.approvedBy,
        success: false,
        correlationId:
          input.options.correlationId,
        resourceId:
          input.plan.projectId,
        details: {
          error: message
        }
      });

      throw error;
    } finally {
      if (lockAcquired) {
        this.locks.release(
          resourceKey,
          input.actor
        );
      }
    }
  }

  private countActorExecutionsLastHour(
    actor: string
  ): number {
    const cutoff =
      Date.now() - 60 * 60 * 1000;

    return this.history
      .list(1000)
      .filter((record) =>
        record.actor === actor &&
        record.action === "execution-started" &&
        new Date(record.timestamp).getTime() >= cutoff
      )
      .length;
  }

  private writeAudit(
    event: Parameters<
      AvosFactoryAuditService["append"]
    >[0]
  ): void {
    this.audit.append(event);
    this.metrics.increment("auditEventsWritten");
  }
}
