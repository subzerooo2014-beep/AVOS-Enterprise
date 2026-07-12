import { EnterpriseCivilizationOrchestrationResult } from "./orchestrator-v8";

export interface UltraMegaPackKHealth {
  healthy: boolean;
  status: string;
  score: number;
  portfolioValue: number;
  portfolioScore: number;
  viableInitiatives: number;
  capabilityMatches: number;
  unmatchedCapabilityRequests: number;
  fundingAllocations: number;
  selfFundingRatio: number;
  innovationProposals: number;
  unmatchedInnovationOpportunities: number;
  civilizationActive: boolean;
  civilizationReadiness: number;
  civilizationAutonomy: number;
  findingCount: number;
  evidenceCount: number;
}

export class UltraMegaPackKRuntimeVerifier {
  verify(
    result: EnterpriseCivilizationOrchestrationResult,
  ): UltraMegaPackKHealth {
    return {
      healthy:
        result.success &&
        result.economy.portfolioScore >= 70 &&
        result.capabilityExchange.unmatchedRequests.length === 0 &&
        result.innovation.proposals.length > 0 &&
        result.civilization.active,
      status: result.status,
      score: result.score,
      portfolioValue: result.economy.portfolioValue,
      portfolioScore: result.economy.portfolioScore,
      viableInitiatives: result.economy.initiatives.filter(
        (initiative) => initiative.viable,
      ).length,
      capabilityMatches: result.capabilityExchange.matches.length,
      unmatchedCapabilityRequests:
        result.capabilityExchange.unmatchedRequests.length,
      fundingAllocations: result.funding.allocations.length,
      selfFundingRatio: result.funding.selfFundingRatio,
      innovationProposals: result.innovation.proposals.length,
      unmatchedInnovationOpportunities:
        result.innovation.unmatchedOpportunities.length,
      civilizationActive: result.civilization.active,
      civilizationReadiness: result.civilization.readinessScore,
      civilizationAutonomy: result.civilization.autonomyScore,
      findingCount: result.findings.length,
      evidenceCount: result.evidence.length,
    };
  }
}
