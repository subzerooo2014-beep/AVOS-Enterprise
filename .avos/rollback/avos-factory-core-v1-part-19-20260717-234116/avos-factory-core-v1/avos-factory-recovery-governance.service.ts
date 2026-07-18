import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryRecoveryRecommendation
} from "./avos-factory-release-health.contracts";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryRecoveryGovernanceService {
  private readonly recommendations: AvosFactoryRecoveryRecommendation[] = [];

  constructor(
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly deployments: AvosFactoryDeploymentExecutionService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  recommend(input: {
    reportId: string;
    actor: string;
  }): AvosFactoryRecoveryRecommendation {
    const report = this.health.get(input.reportId);

    if (!report) {
      throw new BadRequestException(
        `Release health report not found: ${input.reportId}`
      );
    }

    let decision: AvosFactoryRecoveryRecommendation["decision"] = "none";
    let reason = "Release health is within expected operating thresholds.";

    if (report.level === "critical") {
      decision = "rollback-recommended";
      reason = "Critical release health requires controlled rollback review.";
    }
    else if (
      report.level === "degraded" ||
      report.blockingFindings.length > 0
    ) {
      decision = "observe";
      reason = "Release health is degraded and requires active observation.";
    }

    const now = new Date().toISOString();

    const recommendation: AvosFactoryRecoveryRecommendation = {
      id: randomUUID(),
      deploymentExecutionId: report.deploymentExecutionId,
      deploymentPlanId: report.deploymentPlanId,
      reportId: report.id,
      decision,
      reason,
      humanApprovalRequired: decision === "rollback-recommended",
      createdAt: now,
      updatedAt: now
    };

    this.recommendations.unshift(recommendation);

    this.audit.append({
      category: "governance",
      action: "factory-recovery-recommendation-created",
      actor: input.actor,
      success: true,
      resourceId: recommendation.id,
      details: {
        reportId: report.id,
        decision,
        reason,
        humanApprovalRequired: recommendation.humanApprovalRequired
      }
    });

    return structuredClone(recommendation);
  }

  approveRollback(input: {
    recommendationId: string;
    approvedBy: string;
    actor: string;
    humanApproved: boolean;
    reason: string;
  }): AvosFactoryRecoveryRecommendation {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Recovery rollback requires Human Final Authority approval."
      );
    }

    const recommendation = this.recommendations.find(
      (candidate) => candidate.id === input.recommendationId
    );

    if (!recommendation) {
      throw new BadRequestException(
        `Recovery recommendation not found: ${input.recommendationId}`
      );
    }

    if (recommendation.decision !== "rollback-recommended") {
      throw new BadRequestException(
        "Only rollback-recommended decisions can be approved."
      );
    }

    recommendation.decision = "rollback-approved";
    recommendation.approvedBy = input.approvedBy;
    recommendation.reason = input.reason;
    recommendation.updatedAt = new Date().toISOString();

    this.audit.append({
      category: "governance",
      action: "factory-recovery-rollback-approved",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: true,
      resourceId: recommendation.id,
      details: {
        deploymentExecutionId: recommendation.deploymentExecutionId,
        deploymentPlanId: recommendation.deploymentPlanId,
        reason: input.reason
      }
    });

    return structuredClone(recommendation);
  }

  executeApprovedRollback(input: {
    recommendationId: string;
    actor: string;
    reason: string;
  }): AvosFactoryRecoveryRecommendation {
    const recommendation = this.recommendations.find(
      (candidate) => candidate.id === input.recommendationId
    );

    if (!recommendation) {
      throw new BadRequestException(
        `Recovery recommendation not found: ${input.recommendationId}`
      );
    }

    if (
      recommendation.decision !== "rollback-approved" ||
      !recommendation.approvedBy
    ) {
      throw new BadRequestException(
        "Rollback must be approved by Human Final Authority before execution."
      );
    }

    this.deployments.rollback({
      executionId: recommendation.deploymentExecutionId,
      actor: input.actor,
      reason: input.reason
    });

    recommendation.decision = "recovery-completed";
    recommendation.reason = input.reason;
    recommendation.updatedAt = new Date().toISOString();

    this.audit.append({
      category: "execution",
      action: "factory-recovery-rollback-executed",
      actor: input.actor,
      approvedBy: recommendation.approvedBy,
      success: true,
      resourceId: recommendation.id,
      details: {
        deploymentExecutionId: recommendation.deploymentExecutionId,
        deploymentPlanId: recommendation.deploymentPlanId,
        reason: input.reason
      }
    });

    return structuredClone(recommendation);
  }

  list(limit = 100): AvosFactoryRecoveryRecommendation[] {
    return this.recommendations
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((recommendation) => structuredClone(recommendation));
  }
}
