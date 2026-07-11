import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceJsonValue,
  RuntimeRunbookDefinition,
  RuntimeRunbookExecution,
  RuntimeRunbookExecutionStatus,
  RuntimeRunbookStatus,
  RuntimeRunbookStepExecution,
  RuntimeRunbookStepStatus,
} from "../contracts";
import {
  CreateRuntimeRunbookDto,
  ExecuteRuntimeRunbookDto,
  UpdateRuntimeRunbookStatusDto,
} from "../dto";
import {
  RuntimeRunbookStepExecutor,
} from "../executors";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeRunbookService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly executor:
      RuntimeRunbookStepExecutor,
  ) {}

  create(
    dto:
      CreateRuntimeRunbookDto,
  ): RuntimeRunbookDefinition {
    const versions =
      this.store
        .findRunbooksByKey(
          dto.key,
        );

    const version =
      versions.length === 0
        ? 1
        : Math.max(
            ...versions.map(
              (item) =>
                item.version,
            ),
          ) + 1;

    const now =
      new Date().toISOString();

    const runbook:
      RuntimeRunbookDefinition = {
      id:
        randomUUID(),
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      version,
      status:
        RuntimeRunbookStatus.DRAFT,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      requestTypes:
        dto.requestTypes,
      minimumRiskLevel:
        dto.minimumRiskLevel,
      maximumRiskLevel:
        dto.maximumRiskLevel,
      requiresApproval:
        dto.requiresApproval,
      requiredRoles:
        dto.requiredRoles,
      steps:
        dto.steps
          .map(
            (step) => ({
              id:
                step.id,
              name:
                step.name,
              description:
                step.description,
              type:
                step.type,
              order:
                step.order,
              required:
                step.required,
              timeoutSeconds:
                step.timeoutSeconds,
              retryLimit:
                step.retryLimit,
              continueOnFailure:
                step.continueOnFailure,
              condition:
                step.condition as
                  | Record<
                      string,
                      GovernanceJsonValue
                    >
                  | undefined,
              parameters:
                step.parameters as Record<
                  string,
                  GovernanceJsonValue
                >,
              rollbackStepType:
                step.rollbackStepType,
              rollbackParameters:
                step.rollbackParameters as
                  | Record<
                      string,
                      GovernanceJsonValue
                    >
                  | undefined,
            }),
          )
          .sort(
            (a, b) =>
              a.order - b.order,
          ),
      tags:
        dto.tags ?? [],
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdBy:
        dto.actor,
      createdAt:
        now,
      updatedAt:
        now,
    };

    return this.store
      .saveRunbookDefinition(
        runbook,
      );
  }

  list():
    RuntimeRunbookDefinition[] {
    return this.store
      .listRunbookDefinitions();
  }

  get(
    id: string,
  ): RuntimeRunbookDefinition {
    const runbook =
      this.store
        .getRunbookDefinition(id);

    if (!runbook) {
      throw new NotFoundException(
        `Runtime runbook ${id} was not found`,
      );
    }

    return runbook;
  }

  updateStatus(
    id: string,
    dto:
      UpdateRuntimeRunbookStatusDto,
  ): RuntimeRunbookDefinition {
    const runbook =
      this.get(id);

    const now =
      new Date().toISOString();

    runbook.status =
      dto.status;

    runbook.updatedAt =
      now;

    if (
      dto.status ===
      RuntimeRunbookStatus.ACTIVE
    ) {
      runbook.activatedAt =
        now;
    }

    if (
      dto.status ===
      RuntimeRunbookStatus.DISABLED
    ) {
      runbook.disabledAt =
        now;
    }

    if (
      dto.status ===
      RuntimeRunbookStatus.ARCHIVED
    ) {
      runbook.archivedAt =
        now;
    }

    runbook.metadata = {
      ...runbook.metadata,
      lastStatusReason:
        dto.reason,
      lastStatusActorId:
        dto.actor.id,
    };

    return this.store
      .saveRunbookDefinition(
        runbook,
      );
  }

  async execute(
    id: string,
    dto:
      ExecuteRuntimeRunbookDto,
  ): Promise<RuntimeRunbookExecution> {
    const runbook =
      this.get(id);

    if (
      runbook.status !==
      RuntimeRunbookStatus.ACTIVE
    ) {
      throw new BadRequestException(
        `Runbook is not active. Current status: ${runbook.status}`,
      );
    }

    const now =
      new Date().toISOString();

    let execution:
      RuntimeRunbookExecution = {
      id:
        randomUUID(),
      runbookId:
        runbook.id,
      runbookVersion:
        runbook.version,
      governanceRequestId:
        dto.governanceRequestId,
      decisionRecordId:
        dto.decisionRecordId,
      changeExecutionId:
        dto.changeExecutionId,
      status:
        RuntimeRunbookExecutionStatus.RUNNING,
      currentStepOrder:
        0,
      stepExecutions:
        [],
      runtimeContext:
        (dto.runtimeContext ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      dryRun:
        dto.dryRun ?? true,
      startedBy:
        dto.actor,
      startedAt:
        now,
      updatedAt:
        now,
    };

    execution =
      this.store
        .saveRunbookExecution(
          execution,
        );

    try {
      for (
        const step of
        runbook.steps
      ) {
        execution.currentStepOrder =
          step.order;

        let succeeded =
          false;

        let lastError:
          string | undefined;

        for (
          let attempt = 1;
          attempt <=
          step.retryLimit + 1;
          attempt += 1
        ) {
          const startedAt =
            new Date().toISOString();

          const result =
            await this.executor
              .execute({
                step,
                dryRun:
                  execution.dryRun,
                runtimeContext:
                  execution
                    .runtimeContext,
              });

          const stepExecution:
            RuntimeRunbookStepExecution = {
            id:
              randomUUID(),
            runbookExecutionId:
              execution.id,
            stepDefinitionId:
              step.id,
            status:
              result.succeeded
                ? RuntimeRunbookStepStatus.SUCCEEDED
                : RuntimeRunbookStepStatus.FAILED,
            attempt,
            startedAt,
            completedAt:
              new Date().toISOString(),
            output:
              result.output,
            error:
              result.error,
          };

          execution
            .stepExecutions
            .push(
              stepExecution,
            );

          if (
            result.succeeded
          ) {
            succeeded =
              true;

            break;
          }

          lastError =
            result.error;
        }

        execution.updatedAt =
          new Date().toISOString();

        this.store
          .saveRunbookExecution(
            execution,
          );

        if (
          !succeeded &&
          step.required &&
          !step.continueOnFailure
        ) {
          throw new Error(
            lastError ??
            `Runbook step ${step.name} failed`,
          );
        }
      }

      execution.status =
        RuntimeRunbookExecutionStatus.SUCCEEDED;

      execution.completedAt =
        new Date().toISOString();

      execution.updatedAt =
        execution.completedAt;

      return this.store
        .saveRunbookExecution(
          execution,
        );
    } catch (error) {
      execution.status =
        RuntimeRunbookExecutionStatus.FAILED;

      execution.failedAt =
        new Date().toISOString();

      execution.updatedAt =
        execution.failedAt;

      execution.error =
        error instanceof Error
          ? error.message
          : "Unknown runbook execution failure";

      return this.store
        .saveRunbookExecution(
          execution,
        );
    }
  }

  listExecutions():
    RuntimeRunbookExecution[] {
    return this.store
      .listRunbookExecutions();
  }

  getExecution(
    id: string,
  ): RuntimeRunbookExecution {
    const execution =
      this.store
        .getRunbookExecution(id);

    if (!execution) {
      throw new NotFoundException(
        `Runtime runbook execution ${id} was not found`,
      );
    }

    return execution;
  }
}
