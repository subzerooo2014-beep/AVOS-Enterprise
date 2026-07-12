import { randomUUID } from "node:crypto";
import {
  UltraKEvidence,
  UltraKFinding,
  UltraKSeverity,
  UltraKStatus,
} from "./contracts";
import {
  AutonomousEnterpriseEconomy,
  AutonomousEnterpriseEconomyResult,
  EconomicInitiative,
} from "./autonomous-enterprise-economy";
import {
  CapabilityExchangeResult,
  CapabilityRequest,
  EnterpriseCapability,
  UniversalCapabilityExchange,
} from "./capability-exchange";
import {
  FundingCandidate,
  SelfFundingOptimizationResult,
  SelfFundingOptimizer,
} from "./self-funding-optimization";
import {
  GlobalInnovationNetwork,
  GlobalInnovationNetworkResult,
  InnovationNode,
  InnovationOpportunity,
} from "./global-innovation-network";
import {
  CivilizationEngine,
  EnterpriseCivilizationRuntime,
  EnterpriseCivilizationRuntimeResult,
} from "./civilization-runtime";

export interface EnterpriseCivilizationOrchestrationInput {
  systemKey: string;
  economicInitiatives: EconomicInitiative[];
  capabilities: EnterpriseCapability[];
  capabilityRequests: CapabilityRequest[];
  availableBudget: number;
  fundingCandidates: FundingCandidate[];
  innovationNodes: InnovationNode[];
  innovationOpportunities: InnovationOpportunity[];
  civilizationEngines: CivilizationEngine[];
}

export interface EnterpriseCivilizationOrchestrationResult {
  success: boolean;
  status: UltraKStatus;
  score: number;
  economy: AutonomousEnterpriseEconomyResult;
  capabilityExchange: CapabilityExchangeResult;
  funding: SelfFundingOptimizationResult;
  innovation: GlobalInnovationNetworkResult;
  civilization: EnterpriseCivilizationRuntimeResult;
  findings: UltraKFinding[];
  evidence: UltraKEvidence[];
  completedAt: string;
}

export class EnterpriseCivilizationOrchestratorV8 {
  constructor(
    readonly economy = new AutonomousEnterpriseEconomy(),
    readonly capabilityExchange = new UniversalCapabilityExchange(),
    readonly funding = new SelfFundingOptimizer(),
    readonly innovation = new GlobalInnovationNetwork(),
    readonly civilization = new EnterpriseCivilizationRuntime(),
  ) {}

  execute(
    input: EnterpriseCivilizationOrchestrationInput,
  ): EnterpriseCivilizationOrchestrationResult {
    const economy = this.economy.evaluate(input.economicInitiatives);
    const capabilityExchange = this.capabilityExchange.match(
      input.capabilities,
      input.capabilityRequests,
    );
    const funding = this.funding.optimize(
      input.availableBudget,
      input.fundingCandidates,
    );
    const innovation = this.innovation.connect(
      input.innovationNodes,
      input.innovationOpportunities,
    );
    const civilization = this.civilization.activate(
      input.civilizationEngines,
    );

    const findings: UltraKFinding[] = [
      ...economy.findings,
      ...civilization.findings,
    ];

    if (capabilityExchange.unmatchedRequests.length > 0) {
      findings.push({
        code: "CAPABILITY_REQUEST_UNMATCHED",
        severity: UltraKSeverity.ERROR,
        message: "One or more capability requests could not be matched.",
        metadata: {
          unmatchedRequests: capabilityExchange.unmatchedRequests,
        },
      });
    }

    if (innovation.unmatchedOpportunities.length > 0) {
      findings.push({
        code: "INNOVATION_OPPORTUNITY_UNMATCHED",
        severity: UltraKSeverity.WARNING,
        message: "One or more innovation opportunities remain unmatched.",
        metadata: {
          unmatchedOpportunities: innovation.unmatchedOpportunities,
        },
      });
    }

    const capabilityScore =
      input.capabilityRequests.length === 0
        ? 100
        : Math.round(
            (capabilityExchange.matches.length /
              input.capabilityRequests.length) *
              100,
          );

    const fundingScore =
      funding.allocations.length === 0
        ? 100
        : Math.round(
            funding.allocations.reduce(
              (sum, allocation) => sum + allocation.fundingScore,
              0,
            ) / funding.allocations.length,
          );

    const innovationScore =
      innovation.proposals.length === 0
        ? 50
        : Math.round(
            innovation.proposals.reduce(
              (sum, proposal) => sum + proposal.score,
              0,
            ) / innovation.proposals.length,
          );

    const civilizationScore = Math.round(
      (civilization.readinessScore + civilization.autonomyScore) / 2,
    );

    const score = Math.round(
      (
        economy.portfolioScore +
        capabilityScore +
        fundingScore +
        innovationScore +
        civilizationScore
      ) / 5,
    );

    const hasCritical = findings.some(
      (finding) => finding.severity === UltraKSeverity.CRITICAL,
    );
    const hasErrors = findings.some(
      (finding) => finding.severity === UltraKSeverity.ERROR,
    );

    const status = hasCritical
      ? UltraKStatus.BLOCKED
      : hasErrors || score < 65
        ? UltraKStatus.DEGRADED
        : UltraKStatus.READY;

    const success = status === UltraKStatus.READY;

    const evidence: UltraKEvidence[] = [
      {
        id: randomUUID(),
        systemKey: input.systemKey,
        category: "enterprise-civilization-orchestrator-v8",
        action: "civilization-orchestration.completed",
        message: `Enterprise civilization orchestration completed with status ${status}.`,
        metadata: {
          score,
          portfolioValue: economy.portfolioValue,
          capabilityMatches: capabilityExchange.matches.length,
          selfFundingRatio: funding.selfFundingRatio,
          innovationProposals: innovation.proposals.length,
          civilizationReadiness: civilization.readinessScore,
          civilizationAutonomy: civilization.autonomyScore,
        },
        createdAt: new Date().toISOString(),
      },
    ];

    return {
      success,
      status,
      score,
      economy,
      capabilityExchange,
      funding,
      innovation,
      civilization,
      findings,
      evidence,
      completedAt: new Date().toISOString(),
    };
  }
}
