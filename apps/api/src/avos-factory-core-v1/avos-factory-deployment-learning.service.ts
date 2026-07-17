import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeploymentLearningSignal,
  AvosFactoryReleaseIntelligenceReport
} from "./avos-factory-release-intelligence.contracts";
import {
  AvosFactoryReleaseHealthReport
} from "./avos-factory-release-health.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryDeploymentLearningService {
  private readonly signals: AvosFactoryDeploymentLearningSignal[] = [];

  constructor(
    private readonly audit: AvosFactoryAuditService
  ) {}

  learn(
    report: AvosFactoryReleaseHealthReport,
    actor: string
  ): AvosFactoryDeploymentLearningSignal[] {
    const created: AvosFactoryDeploymentLearningSignal[] = [];

    const pushSignal = (
      signalType: AvosFactoryDeploymentLearningSignal["signalType"],
      title: string,
      description: string,
      confidence: number,
      evidence: Record<string, string | number | boolean>
    ) => {
      const signal: AvosFactoryDeploymentLearningSignal = {
        id: randomUUID(),
        deploymentExecutionId: report.deploymentExecutionId,
        deploymentPlanId: report.deploymentPlanId,
        reportId: report.id,
        signalType,
        title,
        description,
        confidence: this.clamp(confidence),
        evidence,
        createdAt: new Date().toISOString()
      };

      this.signals.unshift(signal);
      created.push(signal);
    };

    if (report.score >= 95 && report.blockingFindings.length === 0) {
      pushSignal(
        "success-pattern",
        "High-confidence healthy release",
        "Release health indicates a repeatable successful deployment pattern.",
        96,
        {
          healthScore: report.score,
          level: report.level,
          blockingFindings: report.blockingFindings.length
        }
      );
    }

    if (report.level === "degraded" || report.level === "critical") {
      pushSignal(
        "risk-pattern",
        "Release degradation detected",
        "Release health indicates elevated operational risk.",
        report.level === "critical" ? 98 : 85,
        {
          healthScore: report.score,
          level: report.level,
          blockingFindings: report.blockingFindings.length
        }
      );
    }

    const failedMetrics = report.metrics.filter((metric) => !metric.passed);

    for (const metric of failedMetrics) {
      pushSignal(
        "performance-pattern",
        `${metric.name} threshold failure`,
        `${metric.name} measured ${metric.value} below required ${metric.minimum}.`,
        90,
        {
          metric: metric.name,
          value: metric.value,
          minimum: metric.minimum,
          passed: metric.passed
        }
      );
    }

    if (report.blockingFindings.length === 0) {
      pushSignal(
        "verification-pattern",
        "No blocking post-deployment findings",
        "Verification completed without blocking release health findings.",
        95,
        {
          reportId: report.id,
          healthScore: report.score,
          verified: true
        }
      );
    }

    this.audit.append({
      category: "operations",
      action: "factory-deployment-learning-generated",
      actor,
      success: created.length > 0,
      resourceId: report.id,
      details: {
        deploymentExecutionId: report.deploymentExecutionId,
        deploymentPlanId: report.deploymentPlanId,
        signalsCreated: created.length
      }
    });

    return created.map((signal) => structuredClone(signal));
  }

  list(limit = 200): AvosFactoryDeploymentLearningSignal[] {
    return this.signals
      .slice(0, Math.max(1, Math.min(limit, 2000)))
      .map((signal) => structuredClone(signal));
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
