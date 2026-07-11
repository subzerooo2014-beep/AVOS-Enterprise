import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AssuranceStorageService } from "./assurance-storage.service";
import { CreateRemediationDto } from "./dto/create-remediation.dto";
import {
  RemediationPlan,
  RemediationStatus,
} from "./types/production-hardening-v7.types";

@Injectable()
export class RemediationService {
  private readonly collection = "remediation-plans";

  constructor(
    private readonly storage: AssuranceStorageService,
  ) {}

  async create(
    dto: CreateRemediationDto,
  ): Promise<RemediationPlan> {
    const now = new Date().toISOString();

    const plan: RemediationPlan = {
      id: randomUUID(),
      sourceType: dto.sourceType,
      sourceId: dto.sourceId,
      title: dto.title,
      description: dto.description,
      severity: dto.severity,
      status: "open",
      owner: dto.owner,
      priority: dto.priority,
      dueAt: dto.dueAt,
      actions: (dto.actions ?? []).map(
        (description) => ({
          id: randomUUID(),
          description,
          completed: false,
        }),
      ),
      createdAt: now,
      updatedAt: now,
    };

    return this.storage.append(
      this.collection,
      plan,
    );
  }

  async list(
    status?: RemediationStatus,
  ): Promise<RemediationPlan[]> {
    const plans =
      await this.storage.readCollection<RemediationPlan>(
        this.collection,
      );

    return plans
      .filter((plan) => !status || plan.status === status)
      .sort(
        (a, b) =>
          a.priority - b.priority ||
          b.createdAt.localeCompare(a.createdAt),
      );
  }

  async updateStatus(
    id: string,
    status: RemediationStatus,
  ): Promise<RemediationPlan> {
    const plan =
      await this.storage.findById<RemediationPlan>(
        this.collection,
        id,
      );

    if (!plan) {
      throw new NotFoundException(
        `Remediation plan ${id} was not found`,
      );
    }

    const updated: RemediationPlan = {
      ...plan,
      status,
      updatedAt: new Date().toISOString(),
    };

    await this.storage.replaceById(
      this.collection,
      id,
      updated,
    );

    return updated;
  }

  async completeAction(
    planId: string,
    actionId: string,
  ): Promise<RemediationPlan> {
    const plan =
      await this.storage.findById<RemediationPlan>(
        this.collection,
        planId,
      );

    if (!plan) {
      throw new NotFoundException(
        `Remediation plan ${planId} was not found`,
      );
    }

    const action = plan.actions.find(
      (item) => item.id === actionId,
    );

    if (!action) {
      throw new NotFoundException(
        `Remediation action ${actionId} was not found`,
      );
    }

    const now = new Date().toISOString();

    const actions = plan.actions.map((item) =>
      item.id === actionId
        ? {
            ...item,
            completed: true,
            completedAt: now,
          }
        : item,
    );

    const allCompleted =
      actions.length > 0 &&
      actions.every((item) => item.completed);

    const updated: RemediationPlan = {
      ...plan,
      actions,
      status: allCompleted
        ? "completed"
        : plan.status === "open"
          ? "in_progress"
          : plan.status,
      updatedAt: now,
    };

    await this.storage.replaceById(
      this.collection,
      planId,
      updated,
    );

    return updated;
  }

  async summary(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    blocked: number;
    completed: number;
    criticalOpen: number;
  }> {
    const plans = await this.list();

    return {
      total: plans.length,
      open: plans.filter(
        (plan) => plan.status === "open",
      ).length,
      inProgress: plans.filter(
        (plan) => plan.status === "in_progress",
      ).length,
      blocked: plans.filter(
        (plan) => plan.status === "blocked",
      ).length,
      completed: plans.filter(
        (plan) => plan.status === "completed",
      ).length,
      criticalOpen: plans.filter(
        (plan) =>
          plan.status !== "completed" &&
          plan.status !== "cancelled" &&
          plan.severity === "critical",
      ).length,
    };
  }
}
