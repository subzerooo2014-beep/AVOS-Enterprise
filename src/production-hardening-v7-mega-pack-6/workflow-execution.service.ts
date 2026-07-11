import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EXECUTION_CODE_PREFIX,
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { CreateWorkflowDefinitionDto } from "./dto/create-workflow-definition.dto";
import { StartWorkflowDto } from "./dto/start-workflow.dto";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  WorkflowDefinition,
  WorkflowExecution,
  WorkflowStepDefinition,
  WorkflowStepExecution,
} from "./types/mega-pack-6.types";

@Injectable()
export class WorkflowExecutionService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async createDefinition(
    dto: CreateWorkflowDefinitionDto,
  ): Promise<WorkflowDefinition> {
    const definitions =
      await this.storage.readCollection<WorkflowDefinition>(
        MEGA_PACK_6_COLLECTIONS.workflowDefinitions,
      );

    const version = dto.version ?? 1;

    const duplicate = definitions.find(
      (definition) =>
        definition.workflowCode ===
          dto.workflowCode &&
        definition.version === version,
    );

    if (duplicate) {
      throw new BadRequestException(
        `Workflow ${dto.workflowCode} version ${version} already exists`,
      );
    }

    const now = new Date().toISOString();

    const steps: WorkflowStepDefinition[] =
      dto.steps
        .map((step) => ({
          id: randomUUID(),
          name: step.name,
          stepType: step.stepType,
          handler: step.handler,
          order: step.order,
          timeoutSeconds:
            step.timeoutSeconds,
          retryLimit:
            step.retryLimit ?? 0,
          continueOnFailure:
            step.continueOnFailure ??
            false,
          configuration:
            step.configuration ?? {},
        }))
        .sort(
          (a, b) =>
            a.order - b.order,
        );

    const definition: WorkflowDefinition = {
      id: randomUUID(),
      workflowCode:
        dto.workflowCode,
      name: dto.name,
      description: dto.description,
      version,
      enabled: dto.enabled ?? true,
      triggerType: dto.triggerType,
      steps,
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    definitions.push(definition);

    await this.storage.writeCollection(
      MEGA_PACK_6_COLLECTIONS.workflowDefinitions,
      definitions,
    );

    await this.events.publish({
      eventType:
        "workflow.definition.created",
      source:
        "WorkflowExecutionService",
      severity: "low",
      entityType:
        "workflow_definition",
      entityId: definition.id,
      payload: {
        workflowCode:
          definition.workflowCode,
        version:
          definition.version,
        steps:
          definition.steps.length,
      },
    });

    return definition;
  }

  async listDefinitions():
    Promise<WorkflowDefinition[]> {
    const definitions =
      await this.storage.readCollection<WorkflowDefinition>(
        MEGA_PACK_6_COLLECTIONS.workflowDefinitions,
      );

    return definitions.sort(
      (a, b) =>
        a.workflowCode.localeCompare(
          b.workflowCode,
        ) ||
        b.version - a.version,
    );
  }

  async getDefinition(
    id: string,
  ): Promise<WorkflowDefinition> {
    const definition =
      await this.storage.findById<WorkflowDefinition>(
        MEGA_PACK_6_COLLECTIONS.workflowDefinitions,
        id,
      );

    if (!definition) {
      throw new NotFoundException(
        `Workflow definition ${id} was not found`,
      );
    }

    return definition;
  }

  async start(
    workflowId: string,
    dto: StartWorkflowDto,
  ): Promise<WorkflowExecution> {
    const definition =
      await this.getDefinition(workflowId);

    if (!definition.enabled) {
      throw new BadRequestException(
        "Workflow definition is disabled",
      );
    }

    const now = new Date().toISOString();

    const steps: WorkflowStepExecution[] =
      definition.steps.map(
        (step) => ({
          id: randomUUID(),
          stepDefinitionId:
            step.id,
          name: step.name,
          status: "pending",
          attempts: 0,
        }),
      );

    const execution: WorkflowExecution = {
      id: randomUUID(),
      executionCode:
        this.sequence.next(
          EXECUTION_CODE_PREFIX,
        ),
      workflowId:
        definition.id,
      workflowCode:
        definition.workflowCode,
      workflowVersion:
        definition.version,
      status: "queued",
      trigger: dto.trigger,
      entityReference:
        dto.entityType && dto.entityId
          ? {
              entityType:
                dto.entityType,
              entityId:
                dto.entityId,
            }
          : undefined,
      steps,
      context:
        dto.context ?? {},
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.workflowExecutions,
      execution,
    );

    await this.events.publish({
      eventType:
        "workflow.execution.queued",
      source:
        "WorkflowExecutionService",
      severity: "low",
      entityType:
        "workflow_execution",
      entityId: execution.id,
      payload: {
        executionCode:
          execution.executionCode,
        workflowCode:
          execution.workflowCode,
      },
    });

    return execution;
  }

  async execute(
    executionId: string,
  ): Promise<WorkflowExecution> {
    let execution =
      await this.getExecution(
        executionId,
      );

    const definition =
      await this.getDefinition(
        execution.workflowId,
      );

    if (
      ["completed", "cancelled"].includes(
        execution.status,
      )
    ) {
      return execution;
    }

    const startedAt =
      execution.startedAt ??
      new Date().toISOString();

    execution = {
      ...execution,
      status: "running",
      startedAt,
      updatedAt:
        new Date().toISOString(),
    };

    await this.saveExecution(
      execution,
    );

    for (
      let index = 0;
      index < definition.steps.length;
      index += 1
    ) {
      const definitionStep =
        definition.steps[index];

      const currentStep =
        execution.steps.find(
          (step) =>
            step.stepDefinitionId ===
            definitionStep.id,
        );

      if (
        !currentStep ||
        currentStep.status ===
          "completed" ||
        currentStep.status ===
          "skipped"
      ) {
        continue;
      }

      execution = {
        ...execution,
        currentStepId:
          currentStep.id,
        steps:
          execution.steps.map(
            (step) =>
              step.id ===
              currentStep.id
                ? {
                    ...step,
                    status:
                      "running",
                    attempts:
                      step.attempts +
                      1,
                    startedAt:
                      step.startedAt ??
                      new Date().toISOString(),
                  }
                : step,
          ),
        updatedAt:
          new Date().toISOString(),
      };

      await this.saveExecution(
        execution,
      );

      const stepResult =
        await this.executeStep(
          definitionStep,
          execution.context,
        );

      if (
        stepResult.waitingApproval
      ) {
        execution = {
          ...execution,
          status:
            "waiting_approval",
          steps:
            execution.steps.map(
              (step) =>
                step.id ===
                currentStep.id
                  ? {
                      ...step,
                      status:
                        "waiting",
                      output:
                        stepResult.output,
                    }
                  : step,
            ),
          updatedAt:
            new Date().toISOString(),
        };

        await this.saveExecution(
          execution,
        );

        return execution;
      }

      if (!stepResult.success) {
        const attempts =
          currentStep.attempts + 1;

        if (
          attempts <=
          definitionStep.retryLimit
        ) {
          execution = {
            ...execution,
            steps:
              execution.steps.map(
                (step) =>
                  step.id ===
                  currentStep.id
                    ? {
                        ...step,
                        status:
                          "pending",
                        attempts,
                        errorMessage:
                          stepResult.errorMessage,
                      }
                    : step,
              ),
            updatedAt:
              new Date().toISOString(),
          };

          await this.saveExecution(
            execution,
          );

          index -= 1;
          continue;
        }

        if (
          definitionStep.continueOnFailure
        ) {
          execution = {
            ...execution,
            steps:
              execution.steps.map(
                (step) =>
                  step.id ===
                  currentStep.id
                    ? {
                        ...step,
                        status:
                          "failed",
                        attempts,
                        completedAt:
                          new Date().toISOString(),
                        errorMessage:
                          stepResult.errorMessage,
                      }
                    : step,
              ),
            updatedAt:
              new Date().toISOString(),
          };

          await this.saveExecution(
            execution,
          );

          continue;
        }

        execution = {
          ...execution,
          status: "failed",
          completedAt:
            new Date().toISOString(),
          errorMessage:
            stepResult.errorMessage,
          steps:
            execution.steps.map(
              (step) =>
                step.id ===
                currentStep.id
                  ? {
                      ...step,
                      status:
                        "failed",
                      attempts,
                      completedAt:
                        new Date().toISOString(),
                      errorMessage:
                        stepResult.errorMessage,
                    }
                  : step,
            ),
          updatedAt:
            new Date().toISOString(),
        };

        await this.saveExecution(
          execution,
        );

        await this.events.publish({
          eventType:
            "workflow.execution.failed",
          source:
            "WorkflowExecutionService",
          severity: "high",
          entityType:
            "workflow_execution",
          entityId:
            execution.id,
          payload: {
            executionCode:
              execution.executionCode,
            errorMessage:
              execution.errorMessage,
          },
        });

        return execution;
      }

      execution = {
        ...execution,
        steps:
          execution.steps.map(
            (step) =>
              step.id ===
              currentStep.id
                ? {
                    ...step,
                    status:
                      "completed",
                    completedAt:
                      new Date().toISOString(),
                    output:
                      stepResult.output,
                  }
                : step,
          ),
        context: {
          ...execution.context,
          [`step_${definitionStep.order}`]:
            stepResult.output ?? {},
        },
        updatedAt:
          new Date().toISOString(),
      };

      await this.saveExecution(
        execution,
      );
    }

    execution = {
      ...execution,
      status: "completed",
      currentStepId: undefined,
      completedAt:
        new Date().toISOString(),
      updatedAt:
        new Date().toISOString(),
    };

    await this.saveExecution(
      execution,
    );

    await this.events.publish({
      eventType:
        "workflow.execution.completed",
      source:
        "WorkflowExecutionService",
      severity: "low",
      entityType:
        "workflow_execution",
      entityId: execution.id,
      payload: {
        executionCode:
          execution.executionCode,
        workflowCode:
          execution.workflowCode,
      },
    });

    return execution;
  }

  async getExecution(
    id: string,
  ): Promise<WorkflowExecution> {
    const execution =
      await this.storage.findById<WorkflowExecution>(
        MEGA_PACK_6_COLLECTIONS.workflowExecutions,
        id,
      );

    if (!execution) {
      throw new NotFoundException(
        `Workflow execution ${id} was not found`,
      );
    }

    return execution;
  }

  async listExecutions():
    Promise<WorkflowExecution[]> {
    const executions =
      await this.storage.readCollection<WorkflowExecution>(
        MEGA_PACK_6_COLLECTIONS.workflowExecutions,
      );

    return executions.sort((a, b) =>
      b.createdAt.localeCompare(
        a.createdAt,
      ),
    );
  }

  private async executeStep(
    step: WorkflowStepDefinition,
    context: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    waitingApproval?: boolean;
    output?: Record<string, unknown>;
    errorMessage?: string;
  }> {
    try {
      switch (step.stepType) {
        case "approval":
          return {
            success: true,
            waitingApproval: true,
            output: {
              approvalRequired: true,
              handler: step.handler,
              configuration:
                step.configuration,
            },
          };

        case "condition": {
          const field = String(
            step.configuration.field ??
              "",
          );

          const expected =
            step.configuration.expected;

          const observed =
            context[field];

          const matched =
            JSON.stringify(observed) ===
            JSON.stringify(expected);

          return {
            success:
              matched ||
              step.continueOnFailure,
            output: {
              field,
              expected,
              observed,
              matched,
            },
            errorMessage: matched
              ? undefined
              : `Condition failed for ${field}`,
          };
        }

        case "delay":
          return {
            success: true,
            output: {
              delayed: true,
              durationSeconds:
                Number(
                  step.configuration
                    .durationSeconds ??
                    0,
                ),
            },
          };

        case "notification":
          return {
            success: true,
            output: {
              notificationQueued:
                true,
              channel:
                step.configuration
                  .channel ??
                "internal",
              recipient:
                step.configuration
                  .recipient ??
                "operations",
            },
          };

        case "evidence":
          return {
            success: true,
            output: {
              evidenceRequested:
                true,
              evidenceType:
                step.configuration
                  .evidenceType ??
                "workflow-evidence",
            },
          };

        case "remediation":
          return {
            success: true,
            output: {
              remediationTriggered:
                true,
              handler: step.handler,
              configuration:
                step.configuration,
            },
          };

        case "action":
        default:
          return {
            success: true,
            output: {
              executed: true,
              handler: step.handler,
              configuration:
                step.configuration,
            },
          };
      }
    } catch (error) {
      return {
        success: false,
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown workflow step error",
      };
    }
  }

  private async saveExecution(
    execution: WorkflowExecution,
  ): Promise<void> {
    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.workflowExecutions,
      execution.id,
      execution,
    );
  }
}
