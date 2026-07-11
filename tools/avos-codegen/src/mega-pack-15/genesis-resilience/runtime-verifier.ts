import {
  GenesisResilienceResult,
} from "./contracts";

export interface GenesisResilienceHealth {
  healthy: boolean;
  decision: string;
  score: number;
  confidence: number;
  aggregateResilienceScore: number;
  scenarioCount: number;
  criticalFindingCount: number;
  recoveryActionCount: number;
  automationCoverage: number;
  projectedEvolutionScore: number;
  evidenceCount: number;
  knowledgeCount: number;
}

export class GenesisResilienceRuntimeVerifier {
  verify(
    result:
      GenesisResilienceResult,
  ): GenesisResilienceHealth {
    return {
      healthy:
        result.success &&
        result.simulation.aggregateScore >= 50 &&
        result.decision.approved,
      decision:
        result.decision.decision,
      score:
        result.decision.score,
      confidence:
        result.decision.confidence,
      aggregateResilienceScore:
        result.simulation.aggregateScore,
      scenarioCount:
        result.simulation.scenarioResults.length,
      criticalFindingCount:
        result.simulation.criticalFindings.length,
      recoveryActionCount:
        result.recoveryStrategy.actions.length,
      automationCoverage:
        result.recoveryStrategy.automationCoverage,
      projectedEvolutionScore:
        result.forecast.projectedScore,
      evidenceCount:
        result.evidence.length,
      knowledgeCount:
        result.knowledge.length,
    };
  }
}
