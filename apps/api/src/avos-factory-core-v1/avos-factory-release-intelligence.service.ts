import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseIntelligenceReport
} from "./avos-factory-release-intelligence.contracts";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryDeploymentLearningService
} from "./avos-factory-deployment-learning.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryReleaseIntelligenceService {
  private readonly reports: AvosFactoryReleaseIntelligenceReport[] = [];

  constructor(
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly learning: AvosFactoryDeploymentLearningService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  analyze(input: {
    releaseHealthReportId: string;
    actor: string;
  }): AvosFactoryReleaseIntelligenceReport {
    const healthReport = this.health.get(input.releaseHealthReportId);

    if (!healthReport) {
      throw new BadRequestException(
        `Release health report not found: ${input.releaseHealthReportId}`
      );
    }

    const learningSignals = this.learning.learn(
      healthReport,
      input.actor
    );

    const failurePenalty =
      healthReport.blockingFindings.length * 8;

    const levelPenalty =
      healthReport.level === "critical"
        ? 30
        : healthReport.level === "degraded"
          ? 18
          : healthReport.level === "healthy"
            ? 5
            : 0;

    const score = this.clamp(
      healthReport.score - failurePenalty - levelPenalty
    );

    const riskProbability = this.clamp(
      100 - score +
      healthReport.blockingFindings.length * 5
    );

    const successProbability = this.clamp(
      score - healthReport.blockingFindings.length * 3
    );

    const level =
      score >= 95
        ? "excellent"
        : score >= 85
          ? "stable"
          : score >= 70
            ? "watch"
            : "high-risk";

    const recommendations: string[] = [];

    if (level === "excellent") {
      recommendations.push(
        "Preserve this deployment pattern as a preferred release baseline."
      );
    }

    if (level === "stable") {
      recommendations.push(
        "Continue observation and retain current rollout controls."
      );
    }

    if (level === "watch") {
      recommendations.push(
        "Increase telemetry observation and tighten promotion thresholds."
      );
    }

    if (level === "high-risk") {
      recommendations.push(
        "Require Human Final Authority review before additional promotion."
      );
      recommendations.push(
        "Evaluate controlled rollback or remediation execution."
      );
    }

    for (const finding of healthReport.blockingFindings) {
      recommendations.push(
        `Create a targeted improvement action for ${finding}.`
      );
    }

    const report: AvosFactoryReleaseIntelligenceReport = {
      id: randomUUID(),
      deploymentExecutionId: healthReport.deploymentExecutionId,
      deploymentPlanId: healthReport.deploymentPlanId,
      releaseHealthReportId: healthReport.id,
      score,
      level,
      riskProbability,
      successProbability,
      learningSignals,
      recommendations,
      generatedAt: new Date().toISOString()
    };

    this.reports.unshift(report);

    this.audit.append({
      category: "verification",
      action: "factory-release-intelligence-analyzed",
      actor: input.actor,
      success: level !== "high-risk",
      resourceId: report.id,
      details: {
        releaseHealthReportId: healthReport.id,
        deploymentExecutionId: healthReport.deploymentExecutionId,
        score,
        level,
        riskProbability,
        successProbability
      }
    });

    return structuredClone(report);
  }

  get(id: string): AvosFactoryReleaseIntelligenceReport | undefined {
    const report = this.reports.find((candidate) => candidate.id === id);
    return report ? structuredClone(report) : undefined;
  }

  latest(): AvosFactoryReleaseIntelligenceReport | undefined {
    const report = this.reports[0];
    return report ? structuredClone(report) : undefined;
  }

  list(limit = 100): AvosFactoryReleaseIntelligenceReport[] {
    return this.reports
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((report) => structuredClone(report));
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
