import {
  GenesisIntelligenceResult,
} from "./contracts";

export interface GenesisIntelligenceHealth {
  healthy: boolean;
  outcome: string;
  decisionScore: number;
  validationScore: number;
  planScore: number;
  recommendationCount: number;
  selectedBlueprintCount: number;
  unresolvedCapabilityCount: number;
  dependencyFindingCount: number;
  validationIssueCount: number;
  knowledgeRecordCount: number;
}

export class GenesisIntelligenceRuntimeVerifier {
  verify(
    result:
      GenesisIntelligenceResult,
  ): GenesisIntelligenceHealth {
    const healthy =
      result.success &&
      result.validation.passed &&
      result.optimization.successful;

    return {
      healthy,
      outcome:
        result.decision.outcome,
      decisionScore:
        result.decision.score,
      validationScore:
        result.validation.score,
      planScore:
        result.plan.score,
      recommendationCount:
        result.optimization.recommendations.length,
      selectedBlueprintCount:
        result.optimization.selectedBlueprints.length,
      unresolvedCapabilityCount:
        result.optimization.unresolvedCapabilities.length,
      dependencyFindingCount:
        result.dependencyAnalysis.findings.length,
      validationIssueCount:
        result.validation.issues.length,
      knowledgeRecordCount:
        result.knowledge.records.length,
    };
  }
}
