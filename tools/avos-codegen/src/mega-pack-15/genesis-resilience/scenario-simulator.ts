import {
  ResilienceComponent,
  ResilienceFinding,
  ResilienceImpact,
  ResilienceScenario,
  ResilienceScenarioResult,
  ResilienceSeverity,
  ResilienceSimulationInput,
  ResilienceSimulationResult,
} from "./contracts";

export class GenesisResilienceScenarioSimulator {
  simulate(
    input: ResilienceSimulationInput,
  ): ResilienceSimulationResult {
    const byKey =
      new Map(
        input.components.map(
          (component) => [
            component.key,
            component,
          ],
        ),
      );

    const scenarioResults =
      input.scenarios.map(
        (scenario) =>
          this.simulateScenario(
            scenario,
            input.components,
            byKey,
          ),
      );

    const aggregateScore =
      scenarioResults.length === 0
        ? input.baselineScore
        : Math.round(
            scenarioResults.reduce(
              (total, result) =>
                total +
                result.resilienceScore,
              0,
            ) /
              scenarioResults.length,
          );

    const componentPenalties =
      new Map<string, number>();

    for (const result of scenarioResults) {
      for (
        const component of
        result.impact.affectedComponents
      ) {
        componentPenalties.set(
          component,
          (componentPenalties.get(component) ?? 0) +
            result.impact.blastRadius,
        );
      }
    }

    const weakestComponents =
      Array.from(
        componentPenalties.entries(),
      )
        .sort(
          (left, right) =>
            right[1] - left[1],
        )
        .slice(0, 10)
        .map(
          ([key]) => key,
        );

    const criticalFindings =
      scenarioResults
        .flatMap(
          (result) =>
            result.impact.findings,
        )
        .filter(
          (finding) =>
            finding.severity ===
              ResilienceSeverity.CRITICAL ||
            finding.severity ===
              ResilienceSeverity.ERROR,
        );

    return {
      systemKey:
        input.systemKey,
      scenarioResults,
      aggregateScore:
        Math.max(
          0,
          Math.min(
            100,
            aggregateScore,
          ),
        ),
      weakestComponents,
      criticalFindings,
      simulatedAt:
        new Date().toISOString(),
    };
  }

  private simulateScenario(
    scenario: ResilienceScenario,
    components:
      readonly ResilienceComponent[],
    byKey:
      ReadonlyMap<string, ResilienceComponent>,
  ): ResilienceScenarioResult {
    const directlyAffected =
      new Set(
        scenario.targetComponents,
      );

    const unavailable =
      new Set<string>(
        scenario.targetComponents,
      );

    const degraded =
      new Set<string>();

    let changed = true;

    while (changed) {
      changed = false;

      for (const component of components) {
        if (
          unavailable.has(component.key)
        ) {
          continue;
        }

        const unavailableDependencies =
          component.dependencies.filter(
            (dependency) =>
              unavailable.has(dependency),
          );

        if (
          unavailableDependencies.length ===
          component.dependencies.length &&
          component.dependencies.length > 0
        ) {
          unavailable.add(component.key);
          changed = true;
        }
        else if (
          unavailableDependencies.length > 0
        ) {
          degraded.add(component.key);
        }
      }
    }

    const findings:
      ResilienceFinding[] = [];

    for (const key of unavailable) {
      const component =
        byKey.get(key);

      if (
        component &&
        component.criticality >= 8
      ) {
        findings.push({
          code:
            "CRITICAL_COMPONENT_UNAVAILABLE",
          severity:
            ResilienceSeverity.CRITICAL,
          message:
            `Critical component became unavailable: ${key}`,
          subject: key,
          metadata: {
            criticality:
              component.criticality,
          },
        });
      }
    }

    const affectedComponents =
      Array.from(
        new Set([
          ...directlyAffected,
          ...unavailable,
          ...degraded,
        ]),
      );

    const blastRadius =
      components.length === 0
        ? 0
        : Math.round(
            (
              affectedComponents.length /
              components.length
            ) *
              100,
          );

    const estimatedDowntimeMinutes =
      Array.from(unavailable)
        .map(
          (key) =>
            byKey.get(key)
              ?.recoveryTimeObjectiveMinutes ??
            scenario.durationMinutes,
        )
        .reduce(
          (maximum, value) =>
            Math.max(
              maximum,
              value,
            ),
          scenario.durationMinutes,
        );

    const estimatedDataLossMinutes =
      Array.from(unavailable)
        .map(
          (key) =>
            byKey.get(key)
              ?.recoveryPointObjectiveMinutes ??
            0,
        )
        .reduce(
          (maximum, value) =>
            Math.max(
              maximum,
              value,
            ),
          0,
        );

    const penalty =
      blastRadius * 0.55 +
      Math.min(
        25,
        estimatedDowntimeMinutes / 10,
      ) +
      findings.length * 10;

    const resilienceScore =
      Math.max(
        0,
        Math.min(
          100,
          Math.round(100 - penalty),
        ),
      );

    const impact: ResilienceImpact = {
      scenarioKey:
        scenario.key,
      affectedComponents,
      unavailableComponents:
        Array.from(unavailable),
      degradedComponents:
        Array.from(degraded),
      estimatedDowntimeMinutes,
      estimatedDataLossMinutes,
      blastRadius,
      findings,
    };

    return {
      scenario:
        structuredClone(scenario),
      impact,
      resilienceScore,
      recovered:
        resilienceScore >= 50,
      recoveryActions: [],
    };
  }
}
