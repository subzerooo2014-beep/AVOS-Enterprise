import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AutonomousRecoveryPlan,
  GovernanceAuditEventType,
  GovernanceControlMode,
  GovernanceJsonValue,
  RecoveryAction,
  RecoveryActionStatus,
  RecoveryPlanStatus,
} from "../contracts";
import {
  ApproveRecoveryPlanDto,
  CreateRecoveryPlanDto,
  ExecuteRecoveryPlanDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeAutonomousRecoveryService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  create(
    dto: CreateRecoveryPlanDto,
  ): AutonomousRecoveryPlan {
    if (
      dto.sourceNodeId &&
      !this.store.getDependencyNode(
        dto.sourceNodeId,
      )
    ) {
      throw new NotFoundException(
        `Dependency node ${dto.sourceNodeId} was not found`,
      );
    }

    if (
      dto.cascadeAnalysisId &&
      !this.store.getCascadeAnalysis(
        dto.cascadeAnalysisId,
      )
    ) {
      throw new NotFoundException(
        `Cascade analysis ${dto.cascadeAnalysisId} was not found`,
      );
    }

    if (
      dto.governanceRequestId &&
      !this.store.getGovernanceRequest(
        dto.governanceRequestId,
      )
    ) {
      throw new NotFoundException(
        `Governance request ${dto.governanceRequestId} was not found`,
      );
    }

    const now =
      new Date().toISOString();

    const actions:
      RecoveryAction[] =
      dto.actions
        .map((action) => ({
          id:
            randomUUID(),
          planId:
            "",
          type:
            action.type,
          status:
            RecoveryActionStatus.PENDING,
          name:
            action.name,
          description:
            action.description,
          target:
            action.target,
          order:
            action.order,
          required:
            action.required,
          timeoutSeconds:
            action.timeoutSeconds,
          retryLimit:
            action.retryLimit,
          parameters:
            action.parameters as Record<
              string,
              GovernanceJsonValue
            >,
          rollbackActionType:
            action.rollbackActionType,
          rollbackParameters:
            action.rollbackParameters as
              | Record<
                  string,
                  GovernanceJsonValue
                >
              | undefined,
          executions:
            [],
        }))
        .sort(
          (a, b) =>
            a.order - b.order,
        );

    const planId =
      randomUUID();

    for (const action of actions) {
      action.planId =
        planId;
    }

    const requiresApproval =
      dto.requiresApproval ??
      (
        dto.riskLevel === "high" ||
        dto.riskLevel === "critical"
      );

    const plan:
      AutonomousRecoveryPlan = {
      id:
        planId,
      key:
        dto.key,
      name:
        dto.name,
      description:
        dto.description,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      sourceNodeId:
        dto.sourceNodeId,
      cascadeAnalysisId:
        dto.cascadeAnalysisId,
      governanceRequestId:
        dto.governanceRequestId,
      status:
        requiresApproval
          ? RecoveryPlanStatus.PENDING_APPROVAL
          : RecoveryPlanStatus.READY,
      riskLevel:
        dto.riskLevel,
      requiresApproval,
      approvalsRequired:
        dto.approvalsRequired ??
        (
          dto.riskLevel === "critical"
            ? 3
            : dto.riskLevel === "high"
              ? 2
              : requiresApproval
                ? 1
                : 0
        ),
      approvedBy:
        [],
      actions,
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

    const saved =
      this.store.saveRecoveryPlan(
        plan,
      );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .GOVERNANCE_REQUEST_CREATED,
      aggregateType:
        "autonomous_recovery_plan",
      aggregateId:
        saved.id,
      actor:
        dto.actor,
      payload: {
        recoveryPlanId:
          saved.id,
        key:
          saved.key,
        status:
          saved.status,
        riskLevel:
          saved.riskLevel,
        actions:
          saved.actions.length,
        requiresApproval:
          saved.requiresApproval,
        approvalsRequired:
          saved.approvalsRequired,
      },
    });

    return saved;
  }

  list():
    AutonomousRecoveryPlan[] {
    return this.store
      .listRecoveryPlans();
  }

  get(
    id: string,
  ): AutonomousRecoveryPlan {
    const plan =
      this.store.getRecoveryPlan(id);

    if (!plan) {
      throw new NotFoundException(
        `Recovery plan ${id} was not found`,
      );
    }

    return plan;
  }

  approve(
    id: string,
    dto: ApproveRecoveryPlanDto,
  ): AutonomousRecoveryPlan {
    const plan =
      this.get(id);

    if (
      plan.status !==
      RecoveryPlanStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(
        `Recovery plan is not pending approval. Current status: ${plan.status}`,
      );
    }

    if (
      plan.approvedBy.some(
        (actor) =>
          actor.id === dto.actor.id,
      )
    ) {
      throw new BadRequestException(
        `Actor ${dto.actor.id} already approved this recovery plan`,
      );
    }

    plan.approvedBy.push(
      dto.actor,
    );

    plan.updatedAt =
      new Date().toISOString();

    if (
      plan.approvedBy.length >=
      plan.approvalsRequired
    ) {
      plan.status =
        RecoveryPlanStatus.APPROVED;

      plan.approvedAt =
        plan.updatedAt;
    }

    return this.store
      .saveRecoveryPlan(plan);
  }

  async execute(
    id: string,
    dto: ExecuteRecoveryPlanDto,
  ): Promise<AutonomousRecoveryPlan> {
    let plan =
      this.get(id);

    if (
      this.store.getControlMode() ===
      GovernanceControlMode.LOCKDOWN
    ) {
      throw new BadRequestException(
        "Recovery execution is blocked while governance is in lockdown",
      );
    }

    if (
      ![
        RecoveryPlanStatus.READY,
        RecoveryPlanStatus.APPROVED,
        RecoveryPlanStatus.FAILED,
      ].includes(plan.status)
    ) {
      throw new BadRequestException(
        `Recovery plan cannot execute from status ${plan.status}`,
      );
    }

    const dryRun =
      dto.dryRun ?? true;

    plan.status =
      RecoveryPlanStatus.EXECUTING;

    plan.startedAt =
      new Date().toISOString();

    plan.updatedAt =
      plan.startedAt;

    plan =
      this.store.saveRecoveryPlan(
        plan,
      );

    try {
      for (let index = 0; index < plan.actions.length; index += 1) {
        const action =
          plan.actions[index];

        action.status =
          RecoveryActionStatus.RUNNING;

        const execution: import("../contracts").RecoveryActionExecution = {
          id:
            randomUUID(),
          actionId:
            action.id,
          attempt:
            action.executions.length + 1,
          status:
            RecoveryActionStatus.RUNNING,
          startedAt:
            new Date().toISOString(),
          output:
            {} as Record<
              string,
              GovernanceJsonValue
            >,
        };

        const result =
          this.executeAction(
            action,
            dryRun,
            dto.runtimeContext ?? {},
          );

        execution.completedAt =
          new Date().toISOString();

        execution.status =
          result.succeeded
            ? RecoveryActionStatus.SUCCEEDED
            : RecoveryActionStatus.FAILED;

        execution.output =
          result.output;

        execution.error =
          result.error;

        action.executions.push(
          execution,
        );

        action.status =
          execution.status;

        plan.actions[index] =
          action;

        this.store.saveRecoveryPlan(
          plan,
        );

        if (
          !result.succeeded &&
          action.required
        ) {
          throw new Error(
            result.error ??
            `Recovery action ${action.name} failed`,
          );
        }
      }

      plan.status =
        RecoveryPlanStatus.SUCCEEDED;

      plan.completedAt =
        new Date().toISOString();

      plan.updatedAt =
        plan.completedAt;

      return this.store
        .saveRecoveryPlan(plan);
    } catch (error) {
      plan.status =
        RecoveryPlanStatus.FAILED;

      plan.failedAt =
        new Date().toISOString();

      plan.updatedAt =
        plan.failedAt;

      plan.error =
        error instanceof Error
          ? error.message
          : "Unknown recovery execution failure";

      return this.store
        .saveRecoveryPlan(plan);
    }
  }

  rollback(
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
  ): AutonomousRecoveryPlan {
    const plan =
      this.get(id);

    if (
      ![
        RecoveryPlanStatus.SUCCEEDED,
        RecoveryPlanStatus.FAILED,
      ].includes(plan.status)
    ) {
      throw new BadRequestException(
        `Recovery plan cannot be rolled back from status ${plan.status}`,
      );
    }

    for (
      const action of
      plan.actions
        .slice()
        .sort(
          (a, b) =>
            b.order - a.order,
        )
    ) {
      if (
        action.status ===
          RecoveryActionStatus.SUCCEEDED &&
        action.rollbackActionType
      ) {
        action.status =
          RecoveryActionStatus.ROLLED_BACK;
      }
    }

    plan.status =
      RecoveryPlanStatus.ROLLED_BACK;

    plan.rolledBackAt =
      new Date().toISOString();

    plan.updatedAt =
      plan.rolledBackAt;

    const saved =
      this.store.saveRecoveryPlan(
        plan,
      );

    this.audit.append({
      type:
        GovernanceAuditEventType
          .GOVERNANCE_REQUEST_EVALUATED,
      aggregateType:
        "autonomous_recovery_plan",
      aggregateId:
        saved.id,
      actor,
      payload: {
        recoveryPlanId:
          saved.id,
        status:
          saved.status,
        rolledBackAt:
          saved.rolledBackAt ?? null,
      },
    });

    return saved;
  }

  private executeAction(
    action: RecoveryAction,
    dryRun: boolean,
    runtimeContext:
      Record<string, unknown>,
  ): {
    succeeded: boolean;
    output:
      Record<
        string,
        GovernanceJsonValue
      >;
    error?: string;
  } {
    if (
      action.parameters
        .forceFailure === true
    ) {
      return {
        succeeded:
          false,
        output: {
          dryRun,
          actionType:
            action.type,
          target:
            action.target,
        },
        error:
          "Forced recovery action failure",
      };
    }

    return {
      succeeded:
        true,
      output: {
        dryRun,
        actionType:
          action.type,
        target:
          action.target,
        parameters:
          action.parameters,
        runtimeContext:
          runtimeContext as Record<
            string,
            GovernanceJsonValue
          >,
        executedAt:
          new Date().toISOString(),
      },
    };
  }
}

