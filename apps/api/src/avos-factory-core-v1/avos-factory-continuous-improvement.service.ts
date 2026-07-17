import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryImprovementAction
} from "./avos-factory-release-intelligence.contracts";
import {
  AvosFactoryReleaseIntelligenceService
} from "./avos-factory-release-intelligence.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryContinuousImprovementService {
  private readonly actions: AvosFactoryImprovementAction[] = [];

  constructor(
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  propose(input: {
    intelligenceReportId: string;
    actor: string;
  }): AvosFactoryImprovementAction[] {
    const report = this.intelligence.get(input.intelligenceReportId);

    if (!report) {
      throw new BadRequestException(
        `Release intelligence report not found: ${input.intelligenceReportId}`
      );
    }

    const created: AvosFactoryImprovementAction[] = [];

    const priority =
      report.level === "high-risk"
        ? "critical"
        : report.level === "watch"
          ? "high"
          : report.level === "stable"
            ? "medium"
            : "low";

    const recommendations =
      report.recommendations.length > 0
        ? report.recommendations
        : ["Preserve the successful release baseline."];

    for (const recommendation of recommendations) {
      const now = new Date().toISOString();

      const action: AvosFactoryImprovementAction = {
        id: randomUUID(),
        intelligenceReportId: report.id,
        deploymentPlanId: report.deploymentPlanId,
        title: recommendation.slice(0, 100),
        description: recommendation,
        priority,
        status: "proposed",
        humanApprovalRequired:
          priority === "critical" || priority === "high",
        createdAt: now,
        updatedAt: now
      };

      this.actions.unshift(action);
      created.push(action);
    }

    this.audit.append({
      category: "governance",
      action: "factory-improvement-actions-proposed",
      actor: input.actor,
      success: created.length > 0,
      resourceId: report.id,
      details: {
        intelligenceReportId: report.id,
        deploymentPlanId: report.deploymentPlanId,
        actionsCreated: created.length,
        priority
      }
    });

    return created.map((action) => structuredClone(action));
  }

  approve(input: {
    actionId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
  }): AvosFactoryImprovementAction {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Improvement approval requires Human Final Authority."
      );
    }

    const action = this.actions.find(
      (candidate) => candidate.id === input.actionId
    );

    if (!action) {
      throw new BadRequestException(
        `Improvement action not found: ${input.actionId}`
      );
    }

    action.status = "approved";
    action.approvedBy = input.approvedBy;
    action.updatedAt = new Date().toISOString();

    this.audit.append({
      category: "governance",
      action: "factory-improvement-action-approved",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: action.id,
      details: {
        intelligenceReportId: action.intelligenceReportId,
        deploymentPlanId: action.deploymentPlanId,
        priority: action.priority
      }
    });

    return structuredClone(action);
  }

  implement(input: {
    actionId: string;
    actor: string;
  }): AvosFactoryImprovementAction {
    const action = this.actions.find(
      (candidate) => candidate.id === input.actionId
    );

    if (!action) {
      throw new BadRequestException(
        `Improvement action not found: ${input.actionId}`
      );
    }

    if (
      action.humanApprovalRequired &&
      (action.status !== "approved" || !action.approvedBy)
    ) {
      throw new BadRequestException(
        "Human-approved improvement action is required before implementation."
      );
    }

    action.status = "implemented";
    action.updatedAt = new Date().toISOString();

    this.audit.append({
      category: "execution",
      action: "factory-improvement-action-implemented",
      actor: input.actor,
      approvedBy: action.approvedBy,
      success: true,
      resourceId: action.id,
      details: {
        intelligenceReportId: action.intelligenceReportId,
        deploymentPlanId: action.deploymentPlanId,
        priority: action.priority
      }
    });

    return structuredClone(action);
  }

  list(limit = 200): AvosFactoryImprovementAction[] {
    return this.actions
      .slice(0, Math.max(1, Math.min(limit, 2000)))
      .map((action) => structuredClone(action));
  }
}
