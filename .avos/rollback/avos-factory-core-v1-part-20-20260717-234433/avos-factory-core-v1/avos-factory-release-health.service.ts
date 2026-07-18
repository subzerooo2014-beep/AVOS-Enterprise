import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryReleaseHealthMetric,
  AvosFactoryReleaseHealthReport
} from "./avos-factory-release-health.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryReleaseHealthService {
  private readonly reports: AvosFactoryReleaseHealthReport[] = [];

  constructor(
    private readonly deployments: AvosFactoryDeploymentExecutionService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  evaluate(input: {
    deploymentExecutionId: string;
    environment: string;
    availability?: number;
    latency?: number;
    errorRate?: number;
    smokeSuccess?: number;
    rollbackReadiness?: number;
    actor: string;
  }): AvosFactoryReleaseHealthReport {
    const execution = this.deployments
      .listExecutions(1000)
      .find((candidate) => candidate.id === input.deploymentExecutionId);

    if (!execution) {
      throw new BadRequestException(
        `Deployment execution not found: ${input.deploymentExecutionId}`
      );
    }

    const metrics: AvosFactoryReleaseHealthMetric[] = [
      {
        name: "availability",
        value: this.clamp(input.availability ?? 100),
        minimum: 99,
        weight: 30,
        passed: (input.availability ?? 100) >= 99
      },
      {
        name: "latency",
        value: this.clamp(input.latency ?? 95),
        minimum: 80,
        weight: 20,
        passed: (input.latency ?? 95) >= 80
      },
      {
        name: "errorRate",
        value: this.clamp(input.errorRate ?? 100),
        minimum: 95,
        weight: 20,
        passed: (input.errorRate ?? 100) >= 95
      },
      {
        name: "smokeSuccess",
        value: this.clamp(input.smokeSuccess ?? 100),
        minimum: 100,
        weight: 20,
        passed: (input.smokeSuccess ?? 100) >= 100
      },
      {
        name: "rollbackReadiness",
        value: this.clamp(input.rollbackReadiness ?? 100),
        minimum: 100,
        weight: 10,
        passed: (input.rollbackReadiness ?? 100) >= 100
      }
    ];

    const score = Math.round(
      metrics.reduce(
        (total, metric) =>
          total + ((metric.value / 100) * metric.weight),
        0
      )
    );

    const level =
      score >= 95
        ? "excellent"
        : score >= 85
          ? "healthy"
          : score >= 70
            ? "degraded"
            : "critical";

    const blockingFindings = metrics
      .filter((metric) => !metric.passed)
      .map((metric) => metric.name);

    const report: AvosFactoryReleaseHealthReport = {
      id: randomUUID(),
      deploymentExecutionId: execution.id,
      deploymentPlanId: execution.planId,
      environment: input.environment,
      score,
      level,
      metrics,
      blockingFindings,
      generatedAt: new Date().toISOString()
    };

    this.reports.unshift(report);

    this.audit.append({
      category: "verification",
      action: "factory-release-health-evaluated",
      actor: input.actor,
      success: blockingFindings.length === 0,
      resourceId: report.id,
      details: {
        deploymentExecutionId: execution.id,
        deploymentPlanId: execution.planId,
        environment: input.environment,
        score,
        level,
        blockingFindings
      }
    });

    return structuredClone(report);
  }

  get(id: string): AvosFactoryReleaseHealthReport | undefined {
    const report = this.reports.find((candidate) => candidate.id === id);
    return report ? structuredClone(report) : undefined;
  }

  latest(
    deploymentExecutionId?: string
  ): AvosFactoryReleaseHealthReport | undefined {
    const report = deploymentExecutionId
      ? this.reports.find(
          (candidate) =>
            candidate.deploymentExecutionId === deploymentExecutionId
        )
      : this.reports[0];

    return report ? structuredClone(report) : undefined;
  }

  list(limit = 100): AvosFactoryReleaseHealthReport[] {
    return this.reports
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((report) => structuredClone(report));
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}
