import { Injectable } from "@nestjs/common";
import { AdaptiveLearningMemoryService } from "../if3/adaptive-learning-memory.service";
import { IntelligenceAgentRegistryService } from "../if4/intelligence-agent-registry.service";
import { EnterpriseDecisionIntelligenceService } from "../if5/enterprise-decision-intelligence.service";
import { IntelligenceEvolutionSnapshot } from "../contracts/advanced-intelligence.contracts";

@Injectable()
export class IntelligenceEvolutionEngineService {
  constructor(
    private readonly learning: AdaptiveLearningMemoryService,
    private readonly agents: IntelligenceAgentRegistryService,
    private readonly decisions: EnterpriseDecisionIntelligenceService,
  ) {}

  snapshot(
    certificationStatus = "not-certified",
  ): IntelligenceEvolutionSnapshot {
    const learningProfiles = this.learning.profiles().length;
    const agentCount = this.agents.list().length;
    const decisionCount = this.decisions.count();

    const maturityScore = Math.min(
      100,
      70 +
        Math.min(10, learningProfiles * 2) +
        Math.min(10, agentCount) +
        Math.min(10, decisionCount),
    );

    return {
      version: "IF-6.0.0",
      maturityScore,
      learningProfiles,
      agents: agentCount,
      decisions: decisionCount,
      certificationStatus,
      generatedAt: new Date().toISOString(),
    };
  }
}