import { randomUUID } from "node:crypto";
import {
  EvolutionImpactForecast,
  RecoveryStrategy,
  ResilienceKnowledgeRecord,
  ResilienceSimulationResult,
} from "./contracts";

export class GenesisResilienceKnowledgeRecorder {
  record(
    systemKey: string,
    simulation:
      ResilienceSimulationResult,
    recovery:
      RecoveryStrategy,
    forecast:
      EvolutionImpactForecast,
  ): ResilienceKnowledgeRecord[] {
    return [
      {
        id: randomUUID(),
        systemKey,
        topic:
          "resilience.simulation",
        summary:
          `Resilience simulation completed with aggregate score ${simulation.aggregateScore}.`,
        facts: {
          scenarioCount:
            simulation.scenarioResults.length,
          weakestComponents:
            simulation.weakestComponents,
          criticalFindings:
            simulation.criticalFindings.length,
        },
        createdAt:
          new Date().toISOString(),
      },
      {
        id: randomUUID(),
        systemKey,
        topic:
          "resilience.recovery",
        summary:
          `Recovery strategy contains ${recovery.actions.length} action(s).`,
        facts: {
          estimatedRecoveryMinutes:
            recovery.estimatedRecoveryMinutes,
          estimatedDataLossMinutes:
            recovery.estimatedDataLossMinutes,
          automationCoverage:
            recovery.automationCoverage,
        },
        createdAt:
          new Date().toISOString(),
      },
      {
        id: randomUUID(),
        systemKey,
        topic:
          "resilience.evolution",
        summary:
          `Evolution impact forecast projected score ${forecast.projectedScore}.`,
        facts: {
          projectedScore:
            forecast.projectedScore,
          confidence:
            forecast.confidence,
          risks:
            forecast.risks,
          requiredControls:
            forecast.requiredControls,
        },
        createdAt:
          new Date().toISOString(),
      },
    ];
  }
}
