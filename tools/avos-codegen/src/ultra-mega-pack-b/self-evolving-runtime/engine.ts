import { randomUUID } from "node:crypto";
import {
  UltraBFinding,
  UltraBSeverity,
} from "../contracts";
import {
  RuntimeEvolutionAction,
  RuntimeEvolutionResult,
  RuntimeEvolutionSignal,
} from "./contracts";

export class SelfEvolvingRuntimeEngine {
  evaluate(
    signals: readonly RuntimeEvolutionSignal[],
  ): RuntimeEvolutionResult {
    const findings: UltraBFinding[] = [];
    const actions: RuntimeEvolutionAction[] = [];

    let weightedTotal = 0;
    let totalWeight = 0;

    for (const signal of signals) {
      for (const metric of signal.metrics) {
        totalWeight += metric.weight;
        weightedTotal +=
          Math.min(
            100,
            metric.threshold === 0
              ? 100
              : (metric.value / metric.threshold) * 100,
          ) * metric.weight;

        if (metric.value > metric.threshold) {
          findings.push({
            code: "RUNTIME_THRESHOLD_EXCEEDED",
            severity:
              metric.value > metric.threshold * 1.5
                ? UltraBSeverity.ERROR
                : UltraBSeverity.WARNING,
            message:
              `Runtime metric ${metric.key} exceeded threshold.`,
            subject: metric.key,
            metadata: {
              value: metric.value,
              threshold: metric.threshold,
            },
          });

          actions.push({
            id: randomUUID(),
            key: `evolve-${signal.key}-${metric.key}`,
            description:
              `Adapt runtime for signal ${signal.key} and metric ${metric.key}.`,
            priority:
              Math.round(
                Math.min(
                  100,
                  (metric.value / Math.max(1, metric.threshold)) * 50,
                ),
              ),
            automated: true,
            controls: [
              "rollback-on-failure",
              "post-change-health-check",
            ],
          });
        }
      }
    }

    const pressure =
      totalWeight === 0
        ? 0
        : weightedTotal / totalWeight;

    const score =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(100 - pressure * 0.5),
        ),
      );

    return {
      healthy:
        !findings.some(
          (finding) =>
            finding.severity === UltraBSeverity.ERROR ||
            finding.severity === UltraBSeverity.CRITICAL,
        ),
      score,
      signals: signals.map((item) => structuredClone(item)),
      actions,
      findings,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
