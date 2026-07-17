import { Injectable } from "@nestjs/common";
import {
  EnterpriseDecisionRecord,
  EnterpriseDecisionRequest,
} from "../contracts/advanced-intelligence.contracts";

@Injectable()
export class EnterpriseDecisionIntelligenceService {
  private readonly decisions: EnterpriseDecisionRecord[] = [];

  decide(request: EnterpriseDecisionRequest): EnterpriseDecisionRecord {
    const evidenceScore = Math.min(
      1,
      Math.max(0, request.evidenceScore ?? 0.7),
    );

    const riskPenalty: Record<EnterpriseDecisionRequest["risk"], number> = {
      low: 0.02,
      medium: 0.08,
      high: 0.18,
      critical: 0.3,
    };

    const scoredOptions = request.options.map((option, index) => {
      const base = 0.72 - index * 0.04;
      const score = Math.max(
        0,
        Math.min(
          1,
          base + evidenceScore * 0.2 - riskPenalty[request.risk],
        ),
      );

      return { option, score };
    });

    const best = [...scoredOptions].sort((a, b) => b.score - a.score)[0];
    const confidence = best?.score ?? 0;

    const record: EnterpriseDecisionRecord = {
      id: `if5-decision:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      objective: request.objective,
      selectedOption: best?.option ?? "No option available",
      score: Number(confidence.toFixed(4)),
      confidence: Number(confidence.toFixed(4)),
      risk: request.risk,
      rationale: [
        `Evaluated ${request.options.length} option(s).`,
        `Evidence score: ${evidenceScore.toFixed(4)}.`,
        `Risk level: ${request.risk}.`,
        "Decision remains governed by AVOS human authority rules.",
      ],
      requiresHumanApproval:
        request.requireHumanApproval === true ||
        request.risk === "high" ||
        request.risk === "critical" ||
        confidence < 0.75,
      createdAt: new Date().toISOString(),
    };

    this.decisions.push(record);

    if (this.decisions.length > 5000) {
      this.decisions.splice(0, this.decisions.length - 5000);
    }

    return record;
  }

  list(limit = 100): readonly EnterpriseDecisionRecord[] {
    const normalized = Math.min(Math.max(limit, 1), 1000);
    return this.decisions.slice(-normalized).reverse();
  }

  count(): number {
    return this.decisions.length;
  }
}