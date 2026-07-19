import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  GovernanceDecision,
  GovernanceEvidence,
} from "./omega-governance.types";

@Injectable()
export class DecisionTraceabilityEngineService {
  create(input: {
    readonly subjectId: string;
    readonly compliant: boolean;
    readonly rationale: readonly string[];
    readonly evidence: readonly GovernanceEvidence[];
  }): GovernanceDecision {
    return {
      decisionId: `OMEGA-DECISION-${randomUUID()}`,
      subjectId: input.subjectId,
      status: input.compliant
        ? "pending-human-approval"
        : "remediation-required",
      rationale: input.rationale,
      evidenceIds: input.evidence.map((item) => item.evidenceId),
      decidedAt: new Date().toISOString(),
      decidedBy: "omega-governance-engine",
      humanFinalAuthority: true,
    };
  }

  score(decision: GovernanceDecision): number {
    return decision.rationale.length > 0 &&
      decision.evidenceIds.length > 0 &&
      decision.humanFinalAuthority === true
      ? 100
      : 50;
  }
}
