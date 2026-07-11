import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceDecision,
  GovernanceJsonValue,
  GovernanceRequestStatus,
  RuntimeChangeExecution,
  RuntimeChangeExecutionStatus,
  RuntimeChangeValidation,
  RuntimeDecisionRecordStatus,
  RuntimeExecutionEvidenceType,
  RuntimeLockType,
} from "../contracts";
import {
  CreateRuntimeChangeExecutionDto,
  ExecuteRuntimeChangeDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeAutonomousRecoveryService,
} from "./runtime-autonomous-recovery.service";
import {
  RuntimeDecisionCenterService,
} from "./runtime-decision-center.service";
import {
  RuntimeExecutionEvidenceService,
} from "./runtime-execution-evidence.service";
import {
  RuntimeExecutionLockService,
} from "./runtime-execution-lock.service";
import {
  RuntimeGovernanceRequestService,
} from "./runtime-governance-request.service";
import {
  RuntimeRunbookService,
} from "./runtime-runbook.service";

@Injectable()
export class RuntimeChangeExecutionService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly requests:
      RuntimeGovernanceRequestService,
    private readonly decisions:
      RuntimeDecisionCenterService,
    private readonly locks:
      RuntimeExecutionLockService,
    private readonly runbooks:
      RuntimeRunbookService,
    private readonly recovery:
      RuntimeAutonomousRecoveryService,
    private readonly evidence:
      RuntimeExecutionEvidenceService,
  ) {}

  create(
    dto:
      CreateRuntimeChangeExecutionDto,
  ): RuntimeChangeExecution {
    const request =
      this.requests.get(
        dto.governanceRequestId,
      );

    if (
      dto.decisionRecordId
    ) {
      this.decisions.get(
        dto.decisionRecordId,
      );
    }

    if (
      dto.recoveryPlanId
    ) {
      this.recovery.get(
        dto.recoveryPlanId,
      );
    }

    if (
      dto.isolationPlanId &&
      !this.store.getIsolationPlan(
        dto.isolationPlanId,
      )
    ) {
      throw new NotFoundException(
        `Isolation plan ${dto.isolationPlanId} was not found`,
      );
    }

    const now =
      new Date().toISOString();

    const execution:
      RuntimeChangeExecution = {
      id:
        randomUUID(),
      executionNumber:
        this.nextExecutionNumber(),
      governanceRequestId:
        request.id,
      decisionRecordId:
        dto.decisionRecordId,
      recoveryPlanId:
        dto.recoveryPlanId,
      isolationPlanId:
        dto.isolationPlanId,
      status:
        RuntimeChangeExecutionStatus.CREATED,
      environment:
        request.environment,
      namespace:
        request.namespace,
      service:
        request.service,
      requestType:
        request.type,
      riskLevel:
        request.evaluatedRiskLevel ??
        request.requestedRiskLevel,
      dryRun:
        dto.dryRun ?? true,
      validations:
        [],
      lockIds:
        [],
      evidenceIds:
        [],
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      requestedBy:
        dto.actor,
      createdAt:
        now,
      updatedAt:
        now,
    };

    const saved =
      this.store
        .saveChangeExecution(
          execution,
        );

    const evidence =
      this.evidence.append({
        changeExecutionId:
          saved.id,
        type:
          RuntimeExecutionEvidenceType
            .EXECUTION_CREATED,
        actor:
          dto.actor,
        payload: {
          executionId:
            saved.id,
          executionNumber:
            saved.executionNumber,
          governanceRequestId:
            saved.governanceRequestId,
          dryRun:
            saved.dryRun,
        },
      });

    saved.evidenceIds.push(
      evidence.id,
    );

    return this.store
      .saveChangeExecution(
        saved,
      );
  }

  list():
    RuntimeChangeExecution[] {
    return this.store
      .listChangeExecutions();
  }

  get(
    id: string,
  ): RuntimeChangeExecution {
    const execution =
      this.store
        .getChangeExecution(id);

    if (!execution) {
      throw new NotFoundException(
        `Runtime change execution ${id} was not found`,
      );
    }

    return execution;
  }

  validate(
    id: string,
    actor: {
      id: string;
      type:
        | "user"
        | "service"
        | "system"
        | "automation";
      name?: string;
      roles: string[];
    },
  ): RuntimeChangeExecution {
    const execution =
      this.get(id);

    execution.status =
      RuntimeChangeExecutionStatus.VALIDATING;

    execution.validations =
      this.buildValidations(
        execution,
      );

    const blockingFailures =
      execution.validations
        .filter(
          (item) =>
            !item.success &&
            item.blocking,
        );

    execution.status =
      blockingFailures.length > 0
        ? RuntimeChangeExecutionStatus.BLOCKED
        : RuntimeChangeExecutionStatus.READY;

    execution.updatedAt =
      new Date().toISOString();

    const saved =
      this.store
        .saveChangeExecution(
          execution,
        );

    const evidence =
      this.evidence.append({
        changeExecutionId:
          saved.id,
        type:
          RuntimeExecutionEvidenceType
            .VALIDATION_COMPLETED,
        actor,
        payload: {
          executionId:
            saved.id,
          status:
            saved.status,
          validations:
            saved.validations.length,
          blockingFailures:
            blockingFailures.length,
        },
      });

    saved.evidenceIds.push(
      evidence.id,
    );

    return this.store
      .saveChangeExecution(
        saved,
      );
  }

  async execute(
    id: string,
    dto:
      ExecuteRuntimeChangeDto,
  ): Promise<RuntimeChangeExecution> {
    let execution =
      this.get(id);

    if (
      execution.status ===
      RuntimeChangeExecutionStatus.CREATED
    ) {
      execution =
        this.validate(
          id,
          dto.actor,
        );
    }

    if (
      execution.status !==
      RuntimeChangeExecutionStatus.READY
    ) {
      throw new BadRequestException(
        `Change execution is not ready. Current status: ${execution.status}`,
      );
    }

    const lock =
      this.locks.acquire({
        key:
          `change:${execution.environment}:${execution.namespace}:${execution.service ?? "global"}`,
        type:
          execution.service
            ? RuntimeLockType.SERVICE
            : RuntimeLockType.NAMESPACE,
        environment:
          execution.environment,
        namespace:
          execution.namespace,
        service:
          execution.service,
        changeExecutionId:
          execution.id,
        ttlSeconds:
          3600,
        metadata: {
          executionNumber:
            execution.executionNumber,
        },
        actor:
          dto.actor,
      });

    execution.lockIds.push(
      lock.id,
    );

    execution.status =
      RuntimeChangeExecutionStatus.EXECUTING;

    execution.startedAt =
      new Date().toISOString();

    execution.updatedAt =
      execution.startedAt;

    execution =
      this.store
        .saveChangeExecution(
          execution,
        );

    try {
      const runbook =
        this.selectRunbook(
          execution,
        );

      if (runbook) {
        const runbookExecution =
          await this.runbooks.execute(
            runbook.id,
            {
              governanceRequestId:
                execution.governanceRequestId,
              decisionRecordId:
                execution.decisionRecordId,
              changeExecutionId:
                execution.id,
              dryRun:
                execution.dryRun,
              runtimeContext:
                dto.runtimeContext ?? {},
              actor:
                dto.actor,
            },
          );

        execution.runbookExecutionId =
          runbookExecution.id;

        if (
          runbookExecution.status !==
          "succeeded"
        ) {
          throw new Error(
            runbookExecution.error ??
            "Runbook execution failed",
          );
        }
      }

      execution.status =
        RuntimeChangeExecutionStatus.SUCCEEDED;

      execution.completedAt =
        new Date().toISOString();

      execution.updatedAt =
        execution.completedAt;

      const saved =
        this.store
          .saveChangeExecution(
            execution,
          );

      this.locks.release(
        lock.id,
        {
          reason:
            "Change execution completed",
          actor:
            dto.actor,
        },
      );

      const evidence =
        this.evidence.append({
          changeExecutionId:
            saved.id,
          runbookExecutionId:
            saved.runbookExecutionId,
          type:
            RuntimeExecutionEvidenceType
              .EXECUTION_SUCCEEDED,
          actor:
            dto.actor,
          payload: {
            executionId:
              saved.id,
            status:
              saved.status,
            completedAt:
              saved.completedAt ??
              null,
          },
        });

      saved.evidenceIds.push(
        evidence.id,
      );

      return this.store
        .saveChangeExecution(
          saved,
        );
    } catch (error) {
      execution.status =
        RuntimeChangeExecutionStatus.FAILED;

      execution.failedAt =
        new Date().toISOString();

      execution.updatedAt =
        execution.failedAt;

      execution.error =
        error instanceof Error
          ? error.message
          : "Unknown change execution failure";

      const failed =
        this.store
          .saveChangeExecution(
            execution,
          );

      this.locks.forceRelease(
        lock.id,
        {
          reason:
            "Change execution failed",
          actor:
            dto.actor,
        },
      );

      const evidence =
        this.evidence.append({
          changeExecutionId:
            failed.id,
          runbookExecutionId:
            failed.runbookExecutionId,
          type:
            RuntimeExecutionEvidenceType
              .EXECUTION_FAILED,
          actor:
            dto.actor,
          payload: {
            executionId:
              failed.id,
            status:
              failed.status,
            error:
              failed.error ?? null,
          },
        });

      failed.evidenceIds.push(
        evidence.id,
      );

      return this.store
        .saveChangeExecution(
          failed,
        );
    }
  }

  private buildValidations(
    execution:
      RuntimeChangeExecution,
  ): RuntimeChangeValidation[] {
    const request =
      this.requests.get(
        execution.governanceRequestId,
      );

    const validations:
      RuntimeChangeValidation[] = [];

    validations.push(
      this.validation(
        "request_status",
        "Governance request approved",
        [
          GovernanceRequestStatus.APPROVED,
          GovernanceRequestStatus.EXECUTED,
        ].includes(
          request.status,
        ),
        true,
        "approved",
        request.status,
        "Governance request must be approved",
      ),
    );

    if (
      execution.decisionRecordId
    ) {
      const decision =
        this.decisions.get(
          execution.decisionRecordId,
        );

      validations.push(
        this.validation(
          "decision_status",
          "Runtime decision accepted",
          [
            RuntimeDecisionRecordStatus.ACCEPTED,
            RuntimeDecisionRecordStatus.EXECUTED,
          ].includes(
            decision.status,
          ),
          true,
          "accepted",
          decision.status,
          "Runtime decision must be accepted",
        ),
      );

      validations.push(
        this.validation(
          "decision_not_blocked",
          "Runtime decision does not block execution",
          decision.decision !==
            GovernanceDecision.BLOCK,
          true,
          "not_block",
          decision.decision,
          "Runtime decision must not be block",
        ),
      );
    }

    validations.push(
      this.validation(
        "rollback_plan",
        "Rollback plan available",
        request.rollbackPlanAvailable ||
          Boolean(
            execution.recoveryPlanId,
          ),
        execution.riskLevel ===
          "high" ||
          execution.riskLevel ===
          "critical",
        true,
        request.rollbackPlanAvailable ||
          Boolean(
            execution.recoveryPlanId,
          ),
        "High-risk changes require rollback capability",
      ),
    );

    return validations;
  }

  private validation(
    key: string,
    name: string,
    success: boolean,
    blocking: boolean,
    expected:
      GovernanceJsonValue,
    actual:
      GovernanceJsonValue,
    reason: string,
  ): RuntimeChangeValidation {
    return {
      id:
        randomUUID(),
      key,
      name,
      success,
      blocking,
      expected,
      actual,
      reason,
      checkedAt:
        new Date().toISOString(),
    };
  }

  private selectRunbook(
    execution:
      RuntimeChangeExecution,
  ) {
    const runbooks =
      this.runbooks
        .list()
        .filter(
          (runbook) =>
            runbook.status ===
              "active" &&
            (
              !runbook.environment ||
              runbook.environment ===
                execution.environment
            ) &&
            (
              !runbook.namespace ||
              runbook.namespace ===
                execution.namespace
            ) &&
            (
              !runbook.service ||
              runbook.service ===
                execution.service
            ) &&
            (
              runbook.requestTypes
                .length === 0 ||
              runbook.requestTypes
                .includes(
                  execution.requestType,
                )
            ),
        )
        .sort(
          (a, b) =>
            b.version - a.version,
        );

    return runbooks[0];
  }

  private nextExecutionNumber():
    string {
    const next =
      this.store
        .listChangeExecutions()
        .length + 1;

    return `AVOS-EXEC-${String(
      next,
    ).padStart(6, "0")}`;
  }
}
