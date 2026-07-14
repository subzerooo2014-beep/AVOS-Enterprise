import { Module } from "@nestjs/common";
import { AiEnterpriseBrainV2Service } from "./ai-enterprise-brain-v2.service";
import { AutonomousExecutionMeshService } from "./autonomous-execution-mesh.service";
import { EnterpriseDecisionIntelligenceService } from "./enterprise-decision-intelligence.service";
import { EnterpriseDigitalConstitutionService } from "./enterprise-digital-constitution.service";
import { EnterpriseFinancialIntelligenceService } from "./enterprise-financial-intelligence.service";
import { EnterpriseGlobalOrchestratorService } from "./enterprise-global-orchestrator.service";
import { EnterpriseGrowthIntelligenceService } from "./enterprise-growth-intelligence.service";
import { EnterpriseMarketplaceIntelligenceService } from "./enterprise-marketplace-intelligence.service";
import { EnterpriseMemoryGraphService } from "./enterprise-memory-graph.service";
import { EnterprisePhase5UltraController } from "./enterprise-phase-5-ultra.controller";
import { EnterprisePhase5UltraOrchestratorService } from "./enterprise-phase-5-ultra-orchestrator.service";
import { EnterpriseRiskIntelligenceService } from "./enterprise-risk-intelligence.service";
@Module({
  controllers: [EnterprisePhase5UltraController],
  providers: [AiEnterpriseBrainV2Service, EnterpriseMemoryGraphService, EnterpriseDecisionIntelligenceService, AutonomousExecutionMeshService, EnterpriseDigitalConstitutionService, EnterpriseRiskIntelligenceService, EnterpriseFinancialIntelligenceService, EnterpriseGrowthIntelligenceService, EnterpriseMarketplaceIntelligenceService, EnterpriseGlobalOrchestratorService, EnterprisePhase5UltraOrchestratorService],
  exports: [AiEnterpriseBrainV2Service, EnterpriseMemoryGraphService, EnterpriseDecisionIntelligenceService, AutonomousExecutionMeshService, EnterpriseDigitalConstitutionService, EnterpriseRiskIntelligenceService, EnterpriseFinancialIntelligenceService, EnterpriseGrowthIntelligenceService, EnterpriseMarketplaceIntelligenceService, EnterpriseGlobalOrchestratorService, EnterprisePhase5UltraOrchestratorService],
})
export class EnterprisePhase5UltraModule {}