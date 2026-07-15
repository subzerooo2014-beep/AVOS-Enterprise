import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AiOperationInsight } from "./unified-business-operations.types";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";

@Injectable()
export class AiOperationsService {
  private readonly insights = new Map<string, AiOperationInsight>();

  constructor(
    private readonly workflows: WorkflowOrchestratorService,
    private readonly commandCenter: OperationsCommandCenterService,
  ) {}

  generate(
    tenantId: string,
    category: AiOperationInsight["category"],
    title: string,
    recommendation: string,
    confidence: number,
  ): AiOperationInsight {
    if (confidence < 0 || confidence > 100) {
      throw new Error("confidence must be between 0 and 100");
    }

    const insight: AiOperationInsight = {
      id: randomUUID(),
      tenantId,
      category,
      title,
      recommendation,
      confidence,
      humanReviewRequired:
        category === "EXECUTIVE" || confidence < 70,
      createdAt: new Date().toISOString(),
    };

    this.insights.set(insight.id, insight);
    return { ...insight };
  }

  predictiveSnapshot() {
    const workflow = this.workflows.dashboard();
    const operations = this.commandCenter.dashboard();

    return {
      predictedRisk:
        operations.enterpriseHealth === "CRITICAL"
          ? "HIGH"
          : workflow.failed > 0
            ? "MEDIUM"
            : "LOW",
      bottleneckProbability:
        workflow.paused > 0
          ? Math.min(95, 50 + workflow.paused * 10)
          : 10,
      optimizationPriority:
        workflow.failed > 0
          ? "RECOVERY"
          : workflow.paused > 0
            ? "APPROVAL_LATENCY"
            : "THROUGHPUT",
      generatedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    const insights = Array.from(this.insights.values());

    return {
      insights: insights.length,
      reviewRequired: insights.filter(
        (item) => item.humanReviewRequired,
      ).length,
      averageConfidence:
        insights.length === 0
          ? 0
          : Number(
              (
                insights.reduce(
                  (sum, item) => sum + item.confidence,
                  0,
                ) / insights.length
              ).toFixed(2),
            ),
      predictive: this.predictiveSnapshot(),
      generatedAt: new Date().toISOString(),
    };
  }
}