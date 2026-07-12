import { UltraFFinding, UltraFSeverity } from "./contracts";

export interface EvolutionSignal {
  key: string;
  category: "performance" | "security" | "cost" | "quality" | "usage";
  current: number;
  target: number;
  weight: number;
}

export interface EvolutionAction {
  key: string;
  category: string;
  priority: number;
  expectedImprovement: number;
  requiresApproval: boolean;
}

export interface SelfEvolutionResult {
  healthScore: number;
  actions: EvolutionAction[];
  findings: UltraFFinding[];
  evolvedAt: string;
}

export class SelfEvolutionEngine {
  evolve(signals: readonly EvolutionSignal[]): SelfEvolutionResult {
    const findings: UltraFFinding[] = [];
    const actions: EvolutionAction[] = [];

    for (const signal of signals) {
      const gap = signal.target - signal.current;
      if (gap <= 0) continue;

      const priority = Math.max(
        1,
        Math.min(100, Math.round(gap * signal.weight)),
      );

      actions.push({
        key: `evolve-${signal.key}`,
        category: signal.category,
        priority,
        expectedImprovement: Math.min(100, Math.round(gap)),
        requiresApproval:
          signal.category === "security" || signal.category === "cost",
      });

      if (gap >= 30) {
        findings.push({
          code: "EVOLUTION_GAP_HIGH",
          severity:
            signal.category === "security"
              ? UltraFSeverity.ERROR
              : UltraFSeverity.WARNING,
          message: `Signal ${signal.key} has a high evolution gap.`,
          subject: signal.key,
          metadata: { gap, category: signal.category },
        });
      }
    }

    const healthScore =
      signals.length === 0
        ? 100
        : Math.round(
            signals.reduce(
              (sum, signal) =>
                sum + Math.max(0, Math.min(100, (signal.current / Math.max(1, signal.target)) * 100)),
              0,
            ) / signals.length,
          );

    return {
      healthScore,
      actions: actions.sort((a, b) => b.priority - a.priority),
      findings,
      evolvedAt: new Date().toISOString(),
    };
  }
}
