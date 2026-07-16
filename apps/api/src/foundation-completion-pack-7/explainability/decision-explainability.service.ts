import { Injectable } from "@nestjs/common";
import { DecisionRegistryService } from "../decisions/decision-registry.service";

@Injectable()
export class DecisionExplainabilityService {
  constructor(
    private readonly decisions: DecisionRegistryService
  ) {}

  explain(decisionId: string) {
    const decision = this.decisions.get(decisionId);

    const sortedFactors = [...decision.explainabilityFactors].sort(
      (left, right) =>
        Math.abs(right.contribution) -
        Math.abs(left.contribution)
    );

    const positive = sortedFactors.filter(
      (factor) => factor.contribution > 0
    );

    const negative = sortedFactors.filter(
      (factor) => factor.contribution < 0
    );

    return {
      decisionId: decision.id,
      title: decision.title,
      selectedOption: decision.selectedOption,
      requestedAction: decision.requestedAction,
      rationale: decision.rationale,
      confidence: decision.confidence,
      riskScore: decision.riskScore,
      trustScore: decision.trustScore,
      factors: sortedFactors,
      strongestPositiveFactors: positive.slice(0, 5),
      strongestNegativeFactors: negative.slice(0, 5),
      alternatives: decision.alternatives,
      policyIds: decision.policyIds,
      evidenceIds: decision.evidenceIds,
      provenanceNodeIds: decision.provenanceNodeIds,
      humanApproval: {
        required: decision.requiresHumanApproval,
        approvalId: decision.humanApprovalId
      },
      explainable:
        decision.rationale.trim().length > 0 &&
        decision.explainabilityFactors.length > 0
    };
  }

  summary() {
    const decisions = this.decisions.list();

    return {
      totalDecisions: decisions.length,
      explainable: decisions.filter(
        (decision) =>
          decision.rationale.trim().length > 0 &&
          decision.explainabilityFactors.length > 0
      ).length,
      missingRationale: decisions.filter(
        (decision) => decision.rationale.trim().length === 0
      ).length,
      missingFactors: decisions.filter(
        (decision) => decision.explainabilityFactors.length === 0
      ).length
    };
  }
}
