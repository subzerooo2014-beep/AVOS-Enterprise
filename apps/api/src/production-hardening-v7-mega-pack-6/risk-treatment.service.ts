import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  MEGA_PACK_6_COLLECTIONS,
  TREATMENT_CODE_PREFIX,
} from "./constants/mega-pack-6.constants";
import { CreateRiskTreatmentDto } from "./dto/create-risk-treatment.dto";
import { ApprovalWorkflowService } from "./approval-workflow.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  OperationalStatus,
  RiskTreatmentPlan,
  RiskTreatmentStatus,
} from "./types/mega-pack-6.types";

@Injectable()
export class RiskTreatmentService {
  constructor(
    private readonly storage:
      MegaPack6StorageService,
    private readonly sequence:
      EnterpriseSequenceService,
    private readonly approvals:
      ApprovalWorkflowService,
    private readonly events:
      PlatformEventBusService,
  ) {}

  async create(
    dto: CreateRiskTreatmentDto,
  ): Promise<RiskTreatmentPlan> {
    const now =
      new Date().toISOString();

    const plan: RiskTreatmentPlan = {
      id: randomUUID(),
      treatmentCode:
        this.sequence.next(
          TREATMENT_CODE_PREFIX,
        ),
      riskId: dto.riskId,
      riskCode: dto.riskCode,
      title: dto.title,
      description: dto.description,
      strategy: dto.strategy,
      status: "draft",
      owner: dto.owner,
      targetResidualScore:
        dto.targetResidualScore,
      tasks: (dto.tasks ?? []).map(
        (task) => ({
          id: randomUUID(),
          title: task.title,
          description:
            task.description,
          owner: task.owner,
          status: "planned",
          priority: task.priority,
          dueAt: task.dueAt,
          dependencies:
            task.dependencies ?? [],
        }),
      ),
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      plan,
    );

    await this.events.publish({
      eventType:
        "risk.treatment.created",
      source:
        "RiskTreatmentService",
      severity: "medium",
      entityType:
        "risk_treatment_plan",
      entityId: plan.id,
      payload: {
        treatmentCode:
          plan.treatmentCode,
        riskId: plan.riskId,
        strategy: plan.strategy,
      },
    });

    return plan;
  }

  async list(
    status?: RiskTreatmentStatus,
  ): Promise<RiskTreatmentPlan[]> {
    const plans =
      await this.storage.readCollection<RiskTreatmentPlan>(
        MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      );

    return plans
      .filter(
        (plan) =>
          !status ||
          plan.status === status,
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
  }

  async get(
    id: string,
  ): Promise<RiskTreatmentPlan> {
    const plan =
      await this.storage.findById<RiskTreatmentPlan>(
        MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
        id,
      );

    if (!plan) {
      throw new NotFoundException(
        `Risk treatment plan ${id} was not found`,
      );
    }

    return plan;
  }

  async submitForApproval(
    id: string,
    approvers: string[],
    minimumApprovals: number,
  ): Promise<RiskTreatmentPlan> {
    const plan = await this.get(id);

    if (plan.status !== "draft") {
      throw new BadRequestException(
        "Only draft treatment plans can be submitted for approval",
      );
    }

    const approval =
      await this.approvals.create({
        title:
          `Approve risk treatment ${plan.treatmentCode}`,
        description:
          plan.description,
        requestType:
          "risk_treatment",
        requestedBy: plan.owner,
        requiredApprovers: approvers,
        minimumApprovals,
        entityType:
          "risk_treatment_plan",
        entityId: plan.id,
        metadata: {
          riskId: plan.riskId,
          strategy: plan.strategy,
        },
      });

    const updated: RiskTreatmentPlan = {
      ...plan,
      status: "pending_approval",
      approvalRequestId:
        approval.id,
      updatedAt:
        new Date().toISOString(),
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      id,
      updated,
    );

    return updated;
  }

  async synchronizeApproval(
    id: string,
  ): Promise<RiskTreatmentPlan> {
    const plan = await this.get(id);

    if (!plan.approvalRequestId) {
      return plan;
    }

    const approval =
      await this.approvals.get(
        plan.approvalRequestId,
      );

    let status = plan.status;

    if (
      approval.decision === "approved"
    ) {
      status = "approved";
    } else if (
      approval.decision === "rejected"
    ) {
      status = "rejected";
    } else if (
      approval.decision ===
        "cancelled" ||
      approval.decision === "expired"
    ) {
      status = "cancelled";
    }

    if (status === plan.status) {
      return plan;
    }

    const updated: RiskTreatmentPlan = {
      ...plan,
      status,
      updatedAt:
        new Date().toISOString(),
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      id,
      updated,
    );

    return updated;
  }

  async updateStatus(
    id: string,
    status: RiskTreatmentStatus,
  ): Promise<RiskTreatmentPlan> {
    const plan = await this.get(id);

    this.validateStatusTransition(
      plan.status,
      status,
    );

    const now =
      new Date().toISOString();

    const updated: RiskTreatmentPlan = {
      ...plan,
      status,
      startedAt:
        status === "executing"
          ? plan.startedAt ?? now
          : plan.startedAt,
      completedAt:
        status === "completed"
          ? now
          : plan.completedAt,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      id,
      updated,
    );

    await this.events.publish({
      eventType:
        `risk.treatment.${status}`,
      source:
        "RiskTreatmentService",
      severity:
        status === "completed"
          ? "low"
          : "medium",
      entityType:
        "risk_treatment_plan",
      entityId: id,
      payload: {
        treatmentCode:
          plan.treatmentCode,
        previousStatus:
          plan.status,
        currentStatus: status,
      },
    });

    return updated;
  }

  async updateTaskStatus(
    planId: string,
    taskId: string,
    status: OperationalStatus,
    output?: Record<string, unknown>,
  ): Promise<RiskTreatmentPlan> {
    const plan =
      await this.get(planId);

    const task =
      plan.tasks.find(
        (item) => item.id === taskId,
      );

    if (!task) {
      throw new NotFoundException(
        `Risk treatment task ${taskId} was not found`,
      );
    }

    if (
      status === "active" &&
      task.dependencies.length > 0
    ) {
      const incomplete =
        task.dependencies.filter(
          (dependencyId) => {
            const dependency =
              plan.tasks.find(
                (item) =>
                  item.id ===
                  dependencyId,
              );

            return (
              !dependency ||
              dependency.status !==
                "completed"
            );
          },
        );

      if (incomplete.length > 0) {
        throw new BadRequestException(
          "Task dependencies are not completed",
        );
      }
    }

    const now =
      new Date().toISOString();

    const tasks =
      plan.tasks.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status,
              completedAt:
                status === "completed"
                  ? now
                  : item.completedAt,
              output:
                output ?? item.output,
            }
          : item,
      );

    const allCompleted =
      tasks.length > 0 &&
      tasks.every(
        (item) =>
          item.status === "completed",
      );

    const updated: RiskTreatmentPlan = {
      ...plan,
      tasks,
      status: allCompleted
        ? "completed"
        : plan.status === "approved"
          ? "executing"
          : plan.status,
      startedAt:
        plan.startedAt ??
        (status === "active" ||
        status === "completed"
          ? now
          : undefined),
      completedAt:
        allCompleted
          ? now
          : plan.completedAt,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.riskTreatmentPlans,
      planId,
      updated,
    );

    return updated;
  }

  async summary(): Promise<{
    total: number;
    draft: number;
    pendingApproval: number;
    approved: number;
    executing: number;
    completed: number;
    rejected: number;
  }> {
    const plans = await this.list();

    return {
      total: plans.length,
      draft: plans.filter(
        (plan) =>
          plan.status === "draft",
      ).length,
      pendingApproval: plans.filter(
        (plan) =>
          plan.status ===
          "pending_approval",
      ).length,
      approved: plans.filter(
        (plan) =>
          plan.status === "approved",
      ).length,
      executing: plans.filter(
        (plan) =>
          plan.status === "executing",
      ).length,
      completed: plans.filter(
        (plan) =>
          plan.status === "completed",
      ).length,
      rejected: plans.filter(
        (plan) =>
          plan.status === "rejected",
      ).length,
    };
  }

  private validateStatusTransition(
    current: RiskTreatmentStatus,
    target: RiskTreatmentStatus,
  ): void {
    const transitions:
      Record<
        RiskTreatmentStatus,
        RiskTreatmentStatus[]
      > = {
        draft: [
          "pending_approval",
          "cancelled",
        ],
        pending_approval: [
          "approved",
          "rejected",
          "cancelled",
        ],
        approved: [
          "executing",
          "cancelled",
        ],
        executing: [
          "completed",
          "cancelled",
        ],
        completed: [],
        rejected: [],
        cancelled: [],
      };

    if (
      current !== target &&
      !transitions[current].includes(
        target,
      )
    ) {
      throw new BadRequestException(
        `Invalid risk treatment transition from ${current} to ${target}`,
      );
    }
  }
}
