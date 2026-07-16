import { Injectable } from "@nestjs/common";
import { GovernanceDecision } from "../foundation-pack-5.types";

@Injectable()
export class GovernanceDecisionEngineService {
  private readonly decisions: GovernanceDecision[] = [];

  list() {
    return [...this.decisions];
  }

  decide(
    input: Omit<GovernanceDecision, "id" | "decidedAt">
  ) {
    const decision: GovernanceDecision = {
      ...input,
      id: `governance-decision:${Date.now()}:${
        this.decisions.length + 1
      }`,
      rationale: Array.from(new Set(input.rationale)),
      policyIds: Array.from(new Set(input.policyIds)),
      riskIds: Array.from(new Set(input.riskIds)),
      decidedAt: new Date().toISOString()
    };

    this.decisions.push(decision);
    return decision;
  }

  bySubject(subjectId: string) {
    return this.decisions.filter(
      (decision) => decision.subjectId === subjectId
    );
  }

  summary() {
    return {
      total: this.decisions.length,
      approved: this.decisions.filter(
        (decision) => decision.outcome === "approved"
      ).length,
      rejected: this.decisions.filter(
        (decision) => decision.outcome === "rejected"
      ).length,
      escalated: this.decisions.filter(
        (decision) => decision.outcome === "escalated"
      ).length
    };
  }
}
