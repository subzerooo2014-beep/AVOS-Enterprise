import { randomUUID } from "node:crypto";
import {
  RecoveryAction,
  RecoveryStrategy,
  ResilienceComponent,
  ResilienceSimulationResult,
} from "./contracts";

export class GenesisRecoveryStrategyGenerator {
  generate(
    systemKey: string,
    components:
      readonly ResilienceComponent[],
    simulation:
      ResilienceSimulationResult,
  ): RecoveryStrategy {
    const byKey =
      new Map(
        components.map(
          (component) => [
            component.key,
            component,
          ],
        ),
      );

    const targets =
      Array.from(
        new Set(
          simulation.scenarioResults.flatMap(
            (result) =>
              result.impact.unavailableComponents,
          ),
        ),
      );

    const actions:
      RecoveryAction[] =
      targets.map(
        (target, index) => {
          const component =
            byKey.get(target);

          return {
            id: randomUUID(),
            key:
              `recover-${target}`,
            name:
              `Recover ${target}`,
            description:
              `Restore component ${target} and validate dependent services.`,
            order:
              (index + 1) * 10,
            dependencies:
              component?.dependencies.map(
                (dependency) =>
                  `recover-${dependency}`,
              ) ?? [],
            targetComponent:
              target,
            estimatedDurationMinutes:
              component
                ?.recoveryTimeObjectiveMinutes ??
              30,
            automated:
              (component?.redundancyLevel ?? 0) >
              0,
            controls: [
              "health-verification",
              "dependency-validation",
            ],
          };
        },
      );

    const estimatedRecoveryMinutes =
      actions.reduce(
        (total, action) =>
          total +
          action.estimatedDurationMinutes,
        0,
      );

    const estimatedDataLossMinutes =
      simulation.scenarioResults.reduce(
        (maximum, result) =>
          Math.max(
            maximum,
            result.impact
              .estimatedDataLossMinutes,
          ),
        0,
      );

    const automationCoverage =
      actions.length === 0
        ? 100
        : Math.round(
            (
              actions.filter(
                (action) =>
                  action.automated,
              ).length /
              actions.length
            ) *
              100,
          );

    return {
      systemKey,
      actions,
      estimatedRecoveryMinutes,
      estimatedDataLossMinutes,
      automationCoverage,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
