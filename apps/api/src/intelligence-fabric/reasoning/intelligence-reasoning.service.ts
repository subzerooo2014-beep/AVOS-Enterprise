import { Injectable } from "@nestjs/common";
import {
  IntelligenceDecision,
  IntelligenceInsight,
  IntelligenceRequest,
} from "../contracts/intelligence-fabric.contracts";

@Injectable()
export class IntelligenceReasoningService {
  decide(
    request: IntelligenceRequest,
    insights: readonly IntelligenceInsight[],
  ): IntelligenceDecision {
    const averageConfidence =
      insights.length === 0
        ? 0
        : insights.reduce((sum, item) => sum + item.confidence, 0) /
          insights.length;

    const highPriority = insights.filter(
      (item) => item.priority === "high" || item.priority === "critical",
    );

    const constraints = request.constraints ?? [];
    const requiresHumanApproval =
      highPriority.some((item) => item.priority === "critical") ||
      averageConfidence < 0.65 ||
      constraints.some((item) =>
        /human|approval|manual|موافقة|بشري/iu.test(item),
      );

    const recommendation =
      highPriority.length > 0
        ? `Prioritize ${highPriority[0].title} and validate its evidence before execution.`
        : `Proceed with a controlled baseline action for: ${request.objective}.`;

    return {
      id: `decision:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      objective: request.objective,
      recommendation,
      rationale: insights.map(
        (item) =>
          `${item.title}: ${item.summary} Confidence=${item.confidence}.`,
      ),
      confidence: Number(averageConfidence.toFixed(4)),
      requiresHumanApproval,
      insights,
      createdAt: new Date().toISOString(),
    };
  }
}