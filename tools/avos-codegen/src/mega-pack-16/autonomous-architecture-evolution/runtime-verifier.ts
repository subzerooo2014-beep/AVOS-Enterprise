import {
  ArchitectureEvolutionResult,
} from "./contracts";

export interface ArchitectureEvolutionHealth {
  healthy: boolean;
  decision: string;
  approved: boolean;
  projectedScore: number;
  confidence: number;
  mutationCount: number;
  compatibilityScore: number;
  conflictCount: number;
  resolvedConflictCount: number;
  refactoringRecommendationCount: number;
  healingActionCount: number;
  automationCoverage: number;
  knowledgeRecordCount: number;
}

export class ArchitectureEvolutionRuntimeVerifier {
  verify(
    result:
      ArchitectureEvolutionResult,
  ): ArchitectureEvolutionHealth {
    return {
      healthy:
        result.success &&
        result.simulation.compatibility.compatible &&
        result.decision.approved,
      decision:
        result.decision.decision,
      approved:
        result.decision.approved,
      projectedScore:
        result.simulation.projectedScore,
      confidence:
        result.simulation.confidence,
      mutationCount:
        result.mutationPlan.mutations.length,
      compatibilityScore:
        result.simulation.compatibility.score,
      conflictCount:
        result.conflicts.length,
      resolvedConflictCount:
        result.resolutions.filter(
          (resolution) =>
            resolution.resolved,
        ).length,
      refactoringRecommendationCount:
        result.refactoring.length,
      healingActionCount:
        result.healing.actions.length,
      automationCoverage:
        result.healing.automationCoverage,
      knowledgeRecordCount:
        result.knowledge.length,
    };
  }
}
