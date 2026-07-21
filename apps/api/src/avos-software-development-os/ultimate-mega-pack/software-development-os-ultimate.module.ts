import { Module } from '@nestjs/common';
import { StrategyPlanningService } from './strategy/strategy-planning-service';
import { EngineeringArchitectureService } from './architecture/engineering-architecture-service';
import { MultiAgentSoftwareOrganizationService } from './organization/multi-agent-software-organization-service';
import { DevelopmentTestingIntelligenceService } from './development/development-testing-intelligence-service';
import { EnterpriseDeliveryIntelligenceService } from './delivery/enterprise-delivery-intelligence-service';
import { EnterpriseKnowledgeMemoryService } from './knowledge/enterprise-knowledge-memory-service';
import { GovernanceComplianceService } from './governance/governance-compliance-service';
import { FinalCertificationService } from './certification/final-certification-service';
import { ContinuousEvolutionIntelligenceService } from './evolution/continuous-evolution-intelligence-service';
import { SoftwareDevelopmentOsUltimateController } from './software-development-os-ultimate.controller';
import { SoftwareDevelopmentOsUltimateOrchestratorService } from './software-development-os-ultimate-orchestrator.service';

@Module({
  controllers: [SoftwareDevelopmentOsUltimateController],
  providers: [
    StrategyPlanningService,
    EngineeringArchitectureService,
    MultiAgentSoftwareOrganizationService,
    DevelopmentTestingIntelligenceService,
    EnterpriseDeliveryIntelligenceService,
    EnterpriseKnowledgeMemoryService,
    GovernanceComplianceService,
    FinalCertificationService,
    ContinuousEvolutionIntelligenceService,
    SoftwareDevelopmentOsUltimateOrchestratorService,
  ],
  exports: [SoftwareDevelopmentOsUltimateOrchestratorService],
})
export class SoftwareDevelopmentOsUltimateModule {}
