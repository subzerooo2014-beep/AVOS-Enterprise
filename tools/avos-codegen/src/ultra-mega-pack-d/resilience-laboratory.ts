import { UltraDFinding, UltraDSeverity } from "./contracts";

export interface ResilienceComponent {
  key: string;
  criticality: number;
  redundancy: number;
  recoveryMinutes: number;
  dependencyCount: number;
}

export interface ResilienceExperiment {
  key: string;
  failedComponents: string[];
  durationMinutes: number;
  trafficPercent: number;
}

export interface ResilienceExperimentResult {
  experimentKey: string;
  survived: boolean;
  score: number;
  estimatedRecoveryMinutes: number;
  findings: UltraDFinding[];
}

export interface ResilienceLaboratoryReport {
  aggregateScore: number;
  passedExperiments: number;
  failedExperiments: number;
  results: ResilienceExperimentResult[];
  completedAt: string;
}

export class EnterpriseResilienceLaboratory {
  simulate(
    components: readonly ResilienceComponent[],
    experiments: readonly ResilienceExperiment[],
  ): ResilienceLaboratoryReport {
    const componentMap = new Map(
      components.map((component) => [component.key, component]),
    );

    const results = experiments.map((experiment): ResilienceExperimentResult => {
      const affected = experiment.failedComponents
        .map((key) => componentMap.get(key))
        .filter((value): value is ResilienceComponent => Boolean(value));

      const findings: UltraDFinding[] = [];
      const estimatedRecoveryMinutes = affected.reduce(
        (maximum, component) => Math.max(maximum, component.recoveryMinutes),
        0,
      );

      const impact = affected.reduce(
        (sum, component) =>
          sum +
          component.criticality * 8 +
          component.dependencyCount * 3 -
          component.redundancy * 12,
        0,
      );

      const score = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 -
              impact / Math.max(1, affected.length) -
              experiment.trafficPercent * 0.15 -
              experiment.durationMinutes * 0.05,
          ),
        ),
      );

      if (score < 50) {
        findings.push({
          code: "RESILIENCE_EXPERIMENT_FAILED",
          severity: score < 25 ? UltraDSeverity.CRITICAL : UltraDSeverity.ERROR,
          message: `Experiment ${experiment.key} exposed insufficient resilience.`,
          subject: experiment.key,
          metadata: { score, estimatedRecoveryMinutes },
        });
      }

      return {
        experimentKey: experiment.key,
        survived: score >= 50,
        score,
        estimatedRecoveryMinutes,
        findings,
      };
    });

    const aggregateScore =
      results.length === 0
        ? 100
        : Math.round(
            results.reduce((sum, result) => sum + result.score, 0) /
              results.length,
          );

    return {
      aggregateScore,
      passedExperiments: results.filter((result) => result.survived).length,
      failedExperiments: results.filter((result) => !result.survived).length,
      results,
      completedAt: new Date().toISOString(),
    };
  }
}
