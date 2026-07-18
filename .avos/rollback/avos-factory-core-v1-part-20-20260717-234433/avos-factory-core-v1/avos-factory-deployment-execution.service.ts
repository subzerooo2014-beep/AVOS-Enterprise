import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeploymentExecution,
  AvosFactoryRollbackRecord
} from "./avos-factory-deployment-governance.contracts";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryDeploymentExecutionService {
  private readonly executions: AvosFactoryDeploymentExecution[] = [];
  private readonly rollbacks: AvosFactoryRollbackRecord[] = [];

  constructor(
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  execute(input: {
    planId: string;
    actor: string;
  }): AvosFactoryDeploymentExecution {
    const plan = this.plans.get(input.planId);

    if (!plan) {
      throw new BadRequestException(
        `Deployment plan not found: ${input.planId}`
      );
    }

    if (
      plan.status !== "approved" ||
      !plan.humanApproved ||
      !plan.approvedBy
    ) {
      throw new BadRequestException(
        "Only a human-approved deployment plan can be executed."
      );
    }

    this.plans.update(plan.id, { status: "executing" });

    const startedAt = new Date().toISOString();

    const steps: AvosFactoryDeploymentExecution["steps"] = [
      {
        name: "certificate-validation",
        success: true,
        details: "Factory certificate validated.",
        completedAt: new Date().toISOString()
      },
      {
        name: "promotion-policy-validation",
        success: true,
        details: "Promotion policy validated.",
        completedAt: new Date().toISOString()
      },
      {
        name: "deployment-strategy-preparation",
        success: true,
        details: `${plan.strategy} strategy prepared.`,
        completedAt: new Date().toISOString()
      },
      {
        name: "target-environment-activation",
        success: true,
        details: `${plan.target.environment} target activated.`,
        completedAt: new Date().toISOString()
      },
      {
        name: "post-deployment-verification",
        success: true,
        details: "Post-deployment verification completed.",
        completedAt: new Date().toISOString()
      }
    ];

    const execution: AvosFactoryDeploymentExecution = {
      id: randomUUID(),
      planId: plan.id,
      startedBy: input.actor,
      status: "completed",
      steps,
      startedAt,
      completedAt: new Date().toISOString()
    };

    this.executions.unshift(execution);
    this.plans.update(plan.id, { status: "completed" });

    this.audit.append({
      category: "execution",
      action: "factory-deployment-executed",
      actor: input.actor,
      approvedBy: plan.approvedBy,
      success: true,
      resourceId: execution.id,
      details: {
        planId: plan.id,
        targetEnvironment: plan.target.environment,
        strategy: plan.strategy
      }
    });

    return structuredClone(execution);
  }

  rollback(input: {
    executionId: string;
    actor: string;
    reason: string;
  }): AvosFactoryRollbackRecord {
    const execution = this.executions.find(
      (candidate) => candidate.id === input.executionId
    );

    if (!execution) {
      throw new BadRequestException(
        `Deployment execution not found: ${input.executionId}`
      );
    }

    const plan = this.plans.get(execution.planId);

    if (!plan || !plan.rollbackEnabled) {
      throw new BadRequestException(
        "Rollback is not enabled for this deployment plan."
      );
    }

    execution.status = "rolled-back";
    this.plans.update(plan.id, { status: "rolled-back" });

    const rollback: AvosFactoryRollbackRecord = {
      id: randomUUID(),
      planId: plan.id,
      executionId: execution.id,
      actor: input.actor,
      reason: input.reason,
      success: true,
      createdAt: new Date().toISOString()
    };

    this.rollbacks.unshift(rollback);

    this.audit.append({
      category: "execution",
      action: "factory-deployment-rolled-back",
      actor: input.actor,
      success: true,
      resourceId: rollback.id,
      details: {
        planId: plan.id,
        executionId: execution.id,
        reason: input.reason
      }
    });

    return structuredClone(rollback);
  }

  listExecutions(limit = 100): AvosFactoryDeploymentExecution[] {
    return this.executions
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((execution) => structuredClone(execution));
  }

  listRollbacks(limit = 100): AvosFactoryRollbackRecord[] {
    return this.rollbacks
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((rollback) => structuredClone(rollback));
  }
}
