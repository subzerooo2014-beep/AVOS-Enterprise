import { randomUUID } from "node:crypto";
import { UltraGEvidence, UltraGValue } from "./contracts";

export interface OperationalSignal {
  key: string;
  category: "availability" | "latency" | "capacity" | "security" | "cost";
  value: number;
  warningThreshold: number;
  criticalThreshold: number;
  metadata: Record<string, UltraGValue>;
}

export interface OperationalAction {
  id: string;
  key: string;
  priority: number;
  automated: boolean;
  reason: string;
}

export interface AutonomousOperationsResult {
  healthScore: number;
  actions: OperationalAction[];
  evidence: UltraGEvidence[];
  evaluatedAt: string;
}

export class AutonomousOperationsCenter {
  evaluate(
    systemKey: string,
    signals: readonly OperationalSignal[],
  ): AutonomousOperationsResult {
    const actions: OperationalAction[] = [];
    const evidence: UltraGEvidence[] = [];

    for (const signal of signals) {
      if (signal.value >= signal.criticalThreshold) {
        actions.push({
          id: randomUUID(),
          key: `critical-response-${signal.key}`,
          priority: 100,
          automated: signal.category !== "security",
          reason: `Critical threshold exceeded for ${signal.key}.`,
        });
      } else if (signal.value >= signal.warningThreshold) {
        actions.push({
          id: randomUUID(),
          key: `warning-response-${signal.key}`,
          priority: 60,
          automated: true,
          reason: `Warning threshold exceeded for ${signal.key}.`,
        });
      }
    }

    const healthScore =
      signals.length === 0
        ? 100
        : Math.round(
            signals.reduce((sum, signal) => {
              if (signal.value >= signal.criticalThreshold) return sum + 20;
              if (signal.value >= signal.warningThreshold) return sum + 65;
              return sum + 100;
            }, 0) / signals.length,
          );

    evidence.push({
      id: randomUUID(),
      systemKey,
      category: "autonomous-operations",
      action: "operations.evaluated",
      message: `Operational evaluation produced ${actions.length} actions.`,
      metadata: {
        healthScore,
        actionKeys: actions.map((action) => action.key),
      },
      createdAt: new Date().toISOString(),
    });

    return {
      healthScore,
      actions: actions.sort((a, b) => b.priority - a.priority),
      evidence,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
