import { UltraIFinding, UltraISeverity } from "./contracts";

export interface NegotiablePolicy {
  key: string;
  authority: number;
  riskTolerance: number;
  mandatory: boolean;
  desiredOutcome: string;
  controls: string[];
}

export interface PolicyNegotiationResult {
  agreed: boolean;
  resolution: string;
  winningPolicyKey: string | null;
  controls: string[];
  confidence: number;
  findings: UltraIFinding[];
  negotiatedAt: string;
}

export class AutonomousPolicyNegotiator {
  negotiate(
    policies: readonly NegotiablePolicy[],
  ): PolicyNegotiationResult {
    if (policies.length === 0) {
      return {
        agreed: false,
        resolution: "manual-review",
        winningPolicyKey: null,
        controls: ["human-review"],
        confidence: 0,
        findings: [
          {
            code: "POLICY_NEGOTIATION_EMPTY",
            severity: UltraISeverity.WARNING,
            message: "No policies were supplied for negotiation.",
            metadata: {},
          },
        ],
        negotiatedAt: new Date().toISOString(),
      };
    }

    const ranked = [...policies].sort((a, b) => {
      const left = a.authority * 0.7 + (100 - a.riskTolerance) * 0.3;
      const right = b.authority * 0.7 + (100 - b.riskTolerance) * 0.3;
      return right - left;
    });

    const winner = ranked[0]!;
    const mandatoryConflicts = policies.filter(
      (policy) =>
        policy.mandatory &&
        policy.desiredOutcome !== winner.desiredOutcome,
    );

    const agreed = mandatoryConflicts.length === 0;
    const controls = Array.from(
      new Set(policies.flatMap((policy) => policy.controls)),
    );

    return {
      agreed,
      resolution: agreed ? winner.desiredOutcome : "manual-review",
      winningPolicyKey: agreed ? winner.key : null,
      controls: agreed ? controls : [...controls, "human-review"],
      confidence: Math.max(
        0,
        Math.min(100, Math.round(winner.authority - mandatoryConflicts.length * 20)),
      ),
      findings: mandatoryConflicts.map((policy) => ({
        code: "MANDATORY_POLICY_CONFLICT",
        severity: UltraISeverity.ERROR,
        message: `Mandatory policy ${policy.key} conflicts with negotiated outcome.`,
        subject: policy.key,
        metadata: { desiredOutcome: policy.desiredOutcome },
      })),
      negotiatedAt: new Date().toISOString(),
    };
  }
}
