import { Injectable } from "@nestjs/common";
import {
  FactoryEnforcedRollbackInput,
  FactoryEnforcedRollbackResult
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
  ProjectRollbackEngineService
} from "./project-rollback-engine.service";

@Injectable()
export class AvosFactoryRollbackEnforcementService {
  constructor(
    private readonly rollback:
      ProjectRollbackEngineService,
    private readonly governance:
      AvosFactoryGovernanceService,
    private readonly locks:
      AvosFactoryLockService,
    private readonly idempotency:
      AvosFactoryIdempotencyService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly metrics:
      AvosFactoryEnforcementMetricsService
  ) {}

  async rollbackProject(
    input: FactoryEnforcedRollbackInput
  ): Promise<FactoryEnforcedRollbackResult> {
    this.metrics.increment("rollbacksAttempted");

    const existing =
      this.idempotency.get(input.idempotencyKey);

    if (
      existing?.status === "completed" &&
      existing.result
    ) {
      this.metrics.increment("rollbacksReplayed");

      return {
        replayed: true,
        idempotencyKey:
          input.idempotencyKey,
        result:
          existing.result as FactoryEnforcedRollbackResult["result"]
      };
    }

    this.governance.assertHumanApproval({
      operation: "Project rollback",
      humanApproved:
        input.humanApproved,
      approvedBy:
        input.approvedBy
    });

    const resourceKey =
      `transaction:${input.transactionId}`;

    this.locks.acquire(
      resourceKey,
      input.requestedBy
    );

    this.metrics.increment("locksAcquired");

    this.idempotency.begin(
      input.idempotencyKey,
      "project-rollback",
      input.requestedBy
    );

    this.writeAudit({
      category: "execution",
      action: "project-rollback-started",
      actor: input.requestedBy,
      approvedBy:
        input.approvedBy,
      success: true,
      resourceId:
        input.transactionId,
      details: {
        reason: input.reason,
        idempotencyKey:
          input.idempotencyKey
      }
    });

    try {
      const result =
        await this.rollback.rollback(input);

      this.idempotency.complete(
        input.idempotencyKey,
        result
      );

      this.metrics.increment("rollbacksCompleted");

      this.writeAudit({
        category: "execution",
        action: "project-rollback-completed",
        actor: input.requestedBy,
        approvedBy:
          input.approvedBy,
        success: true,
        resourceId:
          input.transactionId,
        details: {
          restoredBackup:
            result.restoredBackup,
          targetPath:
            result.targetPath
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

      this.metrics.increment("rollbacksFailed");

      this.writeAudit({
        category: "execution",
        action: "project-rollback-failed",
        actor: input.requestedBy,
        approvedBy:
          input.approvedBy,
        success: false,
        resourceId:
          input.transactionId,
        details: {
          error: message
        }
      });

      throw error;
    } finally {
      this.locks.release(
        resourceKey,
        input.requestedBy
      );
    }
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
