import {
  UltraGFinding,
  UltraGSeverity,
} from "./contracts";

export interface InnovationSignal {
  key: string;
  source: "operations" | "customers" | "market" | "architecture" | "ai";
  opportunityScore: number;
  evidenceStrength: number;
  implementationComplexity: number;
}

export interface InnovationProposal {
  key: string;
  source: string;
  priority: number;
  expectedValue: number;
  roadmapPhase: "now" | "next" | "later";
}

export interface ContinuousInnovationResult {
  proposals: InnovationProposal[];
  findings: UltraGFinding[];
  generatedAt: string;
}

export class ContinuousInnovationEngine {
  generate(
    signals: readonly InnovationSignal[],
  ): ContinuousInnovationResult {
    const findings: UltraGFinding[] = [];

    const proposals = signals
      .map((signal): InnovationProposal => {
        const expectedValue = Math.round(
          signal.opportunityScore * 0.6 +
            signal.evidenceStrength * 0.4 -
            signal.implementationComplexity * 0.25,
        );

        const priority = Math.max(0, Math.min(100, expectedValue));

        return {
          key: `innovation-${signal.key}`,
          source: signal.source,
          priority,
          expectedValue: priority,
          roadmapPhase:
            priority >= 80 ? "now" : priority >= 60 ? "next" : "later",
        };
      })
      .sort((a, b) => b.priority - a.priority);

    for (const proposal of proposals) {
      if (proposal.priority < 40) {
        findings.push({
          code: "INNOVATION_SIGNAL_WEAK",
          severity: UltraGSeverity.INFO,
          message: `Innovation proposal ${proposal.key} has weak evidence.`,
          subject: proposal.key,
          metadata: { priority: proposal.priority },
        });
      }
    }

    return {
      proposals,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
