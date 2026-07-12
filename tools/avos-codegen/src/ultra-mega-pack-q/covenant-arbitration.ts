import { UltraQFinding, UltraQSeverity } from "./contracts";

export interface CovenantClause {
  key: string;
  authority: number;
  mandatory: boolean;
  desiredOutcome: string;
  controls: string[];
}

export interface CovenantArbitrationResult {
  resolved: boolean;
  outcome: string;
  winningClauseKey: string | null;
  confidence: number;
  controls: string[];
  findings: UltraQFinding[];
  arbitratedAt: string;
}

export class AutonomousCovenantArbitrator {
  arbitrate(
    clauses: readonly CovenantClause[],
  ): CovenantArbitrationResult {
    if (clauses.length === 0) {
      return {
        resolved: false,
        outcome: "manual-review",
        winningClauseKey: null,
        confidence: 0,
        controls: ["human-review"],
        findings: [{
          code: "COVENANT_ARBITRATION_EMPTY",
          severity: UltraQSeverity.WARNING,
          message: "No covenant clauses were supplied.",
          metadata: {},
        }],
        arbitratedAt: new Date().toISOString(),
      };
    }

    const ranked = [...clauses].sort((a, b) => b.authority - a.authority);
    const winner = ranked[0]!;
    const conflicts = clauses.filter(
      (clause) =>
        clause.mandatory &&
        clause.desiredOutcome !== winner.desiredOutcome,
    );

    const resolved = conflicts.length === 0;
    const controls = Array.from(new Set(clauses.flatMap((clause) => clause.controls)));

    return {
      resolved,
      outcome: resolved ? winner.desiredOutcome : "manual-review",
      winningClauseKey: resolved ? winner.key : null,
      confidence: Math.max(0, Math.min(100, winner.authority - conflicts.length * 20)),
      controls: resolved ? controls : [...controls, "human-review"],
      findings: conflicts.map((clause) => ({
        code: "COVENANT_MANDATORY_CONFLICT",
        severity: UltraQSeverity.ERROR,
        message: `Mandatory covenant clause ${clause.key} conflicts with the winning outcome.`,
        subject: clause.key,
        metadata: { desiredOutcome: clause.desiredOutcome },
      })),
      arbitratedAt: new Date().toISOString(),
    };
  }
}
