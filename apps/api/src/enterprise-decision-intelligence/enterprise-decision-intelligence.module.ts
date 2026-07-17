import { Module } from "@nestjs/common";
import { EnterpriseDecisionIntelligenceController } from "./enterprise-decision-intelligence.controller";
import { EnterpriseDecisionIntelligenceService } from "./services/enterprise-decision-intelligence.service";
import { EnterpriseDecisionPolicyService } from "./services/enterprise-decision-policy.service";
import { EnterpriseDecisionRuleService } from "./services/enterprise-decision-rule.service";
import { EnterpriseDecisionSimulationService } from "./services/enterprise-decision-simulation.service";
import { EnterpriseDecisionRecommendationService } from "./services/enterprise-decision-recommendation.service";
import { EnterpriseDecisionMemoryService } from "./services/enterprise-decision-memory.service";

@Module({
  controllers: [EnterpriseDecisionIntelligenceController],
  providers: [EnterpriseDecisionIntelligenceService, EnterpriseDecisionPolicyService, EnterpriseDecisionRuleService, EnterpriseDecisionSimulationService, EnterpriseDecisionRecommendationService, EnterpriseDecisionMemoryService],
  exports: [EnterpriseDecisionIntelligenceService, EnterpriseDecisionPolicyService, EnterpriseDecisionRuleService, EnterpriseDecisionSimulationService, EnterpriseDecisionRecommendationService, EnterpriseDecisionMemoryService]
})
export class EnterpriseDecisionIntelligenceModule {}