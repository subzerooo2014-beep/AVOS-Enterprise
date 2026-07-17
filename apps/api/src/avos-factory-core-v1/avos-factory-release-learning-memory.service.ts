import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseLearningMemory
} from "./avos-factory-release-intelligence.contracts";
import {
  AvosFactoryReleaseIntelligenceService
} from "./avos-factory-release-intelligence.service";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryDeploymentPlanService
} from "./avos-factory-deployment-plan.service";
import {
  AvosFactoryDeploymentExecutionService
} from "./avos-factory-deployment-execution.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryReleaseLearningMemoryService {
  private readonly memory: AvosFactoryReleaseLearningMemory[] = [];

  constructor(
    private readonly intelligence: AvosFactoryReleaseIntelligenceService,
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly plans: AvosFactoryDeploymentPlanService,
    private readonly executions: AvosFactoryDeploymentExecutionService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  capture(input: {
    intelligenceReportId: string;
    actor: string;
  }): AvosFactoryReleaseLearningMemory {
    const intelligenceReport = this.intelligence.get(
      input.intelligenceReportId
    );

    if (!intelligenceReport) {
      throw new BadRequestException(
        `Release intelligence report not found: ${input.intelligenceReportId}`
      );
    }

    const healthReport = this.health.get(
      intelligenceReport.releaseHealthReportId
    );

    if (!healthReport) {
      throw new BadRequestException(
        "Associated release health report was not found."
      );
    }

    const plan = this.plans.get(intelligenceReport.deploymentPlanId);

    if (!plan) {
      throw new BadRequestException(
        "Associated deployment plan was not found."
      );
    }

    const execution = this.executions
      .listExecutions(1000)
      .find(
        (candidate) =>
          candidate.id === intelligenceReport.deploymentExecutionId
      );

    if (!execution) {
      throw new BadRequestException(
        "Associated deployment execution was not found."
      );
    }

    const outcome =
      execution.status === "rolled-back"
        ? "rolled-back"
        : execution.status === "failed"
          ? "failed"
          : healthReport.level === "degraded" ||
              healthReport.level === "critical"
            ? "degraded"
            : "successful";

    const lessons = [
      ...intelligenceReport.recommendations,
      ...intelligenceReport.learningSignals.map(
        (signal) => `${signal.title}: ${signal.description}`
      )
    ];

    const record: AvosFactoryReleaseLearningMemory = {
      id: randomUUID(),
      subjectId: plan.subjectId,
      version: plan.version,
      deploymentPlanId: plan.id,
      deploymentExecutionId: execution.id,
      healthScore: healthReport.score,
      intelligenceScore: intelligenceReport.score,
      outcome,
      lessons,
      createdAt: new Date().toISOString()
    };

    this.memory.unshift(record);

    this.audit.append({
      category: "operations",
      action: "factory-release-learning-memory-captured",
      actor: input.actor,
      success: true,
      resourceId: record.id,
      details: {
        subjectId: record.subjectId,
        version: record.version,
        deploymentPlanId: record.deploymentPlanId,
        deploymentExecutionId: record.deploymentExecutionId,
        outcome: record.outcome
      }
    });

    return structuredClone(record);
  }

  list(limit = 200): AvosFactoryReleaseLearningMemory[] {
    return this.memory
      .slice(0, Math.max(1, Math.min(limit, 2000)))
      .map((record) => structuredClone(record));
  }
}
