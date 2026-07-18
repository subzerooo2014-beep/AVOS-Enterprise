import { Injectable } from "@nestjs/common";
import {
  AiGenerationExecutionResult,
  AiGenerationPlan,
  AiGeneratorMetricsSnapshot,
  AiPromptAnalysis
} from "./ai-generator.contracts";
import {
  AiGeneratorHistoryService
} from "./ai-generator-history.service";

@Injectable()
export class AiGeneratorMetricsService {
  private totalRequests = 0;
  private analyzedRequests = 0;
  private plannedRequests = 0;
  private approvedRequests = 0;
  private rejectedRequests = 0;
  private successfulExecutions = 0;
  private failedExecutions = 0;
  private generatedArtifacts = 0;
  private approvalRequiredRequests = 0;
  private totalConfidence = 0;
  private totalDurationMs = 0;

  constructor(
    private readonly history:
      AiGeneratorHistoryService
  ) {}

  recordAnalysis(
    analysis: AiPromptAnalysis
  ): void {
    this.totalRequests += 1;
    this.analyzedRequests += 1;
    this.totalConfidence +=
      analysis.confidence;

    if (
      analysis.requiresHumanApproval
    ) {
      this.approvalRequiredRequests += 1;
    }
  }

  recordPlan(
    plan: AiGenerationPlan
  ): void {
    this.plannedRequests += 1;

    if (plan.approved) {
      this.approvedRequests += 1;
    }
  }

  recordRejected(): void {
    this.rejectedRequests += 1;
  }

  recordExecution(
    result:
      AiGenerationExecutionResult
  ): void {
    this.totalDurationMs +=
      result.durationMs;

    this.generatedArtifacts +=
      result.executions.reduce(
        (sum, execution) =>
          sum +
          execution.artifacts.length,
        0
      );

    if (result.success) {
      this.successfulExecutions += 1;
    } else {
      this.failedExecutions += 1;
    }
  }

  snapshot():
    AiGeneratorMetricsSnapshot {
    return {
      totalRequests:
        this.totalRequests,
      analyzedRequests:
        this.analyzedRequests,
      plannedRequests:
        this.plannedRequests,
      approvedRequests:
        this.approvedRequests,
      rejectedRequests:
        this.rejectedRequests,
      successfulExecutions:
        this.successfulExecutions,
      failedExecutions:
        this.failedExecutions,
      generatedArtifacts:
        this.generatedArtifacts,
      approvalRequiredRequests:
        this.approvalRequiredRequests,
      averageConfidence:
        this.analyzedRequests === 0
          ? 0
          : Number(
              (
                this.totalConfidence /
                this.analyzedRequests
              ).toFixed(2)
            ),
      averageDurationMs:
        (
          this.successfulExecutions +
          this.failedExecutions
        ) === 0
          ? 0
          : Math.round(
              this.totalDurationMs /
              (
                this.successfulExecutions +
                this.failedExecutions
              )
            ),
      historyRecords:
        this.history.count(),
      calculatedAt:
        new Date().toISOString()
    };
  }
}
