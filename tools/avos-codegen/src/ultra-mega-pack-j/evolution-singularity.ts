import { UltraJFinding, UltraJSeverity } from "./contracts";

export interface EvolutionSingularitySignal {
  key: string;
  domain: "architecture" | "operations" | "knowledge" | "intelligence" | "governance";
  currentMaturity: number;
  targetMaturity: number;
  autonomy: number;
}

export interface EvolutionSingularityAction {
  key: string;
  domain: string;
  priority: number;
  transformation: string;
}

export interface EnterpriseEvolutionSingularityResult {
  maturityScore: number;
  autonomyScore: number;
  actions: EvolutionSingularityAction[];
  findings: UltraJFinding[];
  evolvedAt: string;
}

export class EnterpriseEvolutionSingularity {
  evolve(
    signals: readonly EvolutionSingularitySignal[],
  ): EnterpriseEvolutionSingularityResult {
    const findings: UltraJFinding[] = [];

    const actions = signals
      .filter((signal) => signal.currentMaturity < signal.targetMaturity)
      .map((signal): EvolutionSingularityAction => {
        const gap = signal.targetMaturity - signal.currentMaturity;
        const priority = Math.max(
          1,
          Math.min(100, Math.round(gap * 0.7 + (100 - signal.autonomy) * 0.3)),
        );

        if (gap >= 25) {
          findings.push({
            code: "EVOLUTION_SINGULARITY_MATURITY_GAP",
            severity: UltraJSeverity.WARNING,
            message: `Domain ${signal.domain} has a significant maturity gap.`,
            subject: signal.key,
            metadata: { gap, autonomy: signal.autonomy },
          });
        }

        return {
          key: `transform-${signal.key}`,
          domain: signal.domain,
          priority,
          transformation: `raise-${signal.domain}-maturity`,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    const maturityScore =
      signals.length === 0
        ? 100
        : Math.round(
            signals.reduce((sum, signal) => sum + signal.currentMaturity, 0) /
              signals.length,
          );

    const autonomyScore =
      signals.length === 0
        ? 100
        : Math.round(
            signals.reduce((sum, signal) => sum + signal.autonomy, 0) /
              signals.length,
          );

    return {
      maturityScore,
      autonomyScore,
      actions,
      findings,
      evolvedAt: new Date().toISOString(),
    };
  }
}
