import { Module } from '@nestjs/common';
import { StrategyPlanningModule } from './strategy/strategy-planning.module';
import { EngineeringArchitectureModule } from './architecture/engineering-architecture.module';
import { MultiAgentSoftwareOrganizationModule } from './organization/multi-agent-software-organization.module';
import { DevelopmentTestingIntelligenceModule } from './development/development-testing-intelligence.module';
import { EnterpriseDeliveryIntelligenceModule } from './delivery/enterprise-delivery-intelligence.module';
import { EnterpriseKnowledgeMemoryModule } from './knowledge/enterprise-knowledge-memory.module';
import { GovernanceComplianceModule } from './governance/governance-compliance.module';
import { FinalCertificationModule } from './certification/final-certification.module';
import { ContinuousEvolutionIntelligenceModule } from './evolution/continuous-evolution-intelligence.module';
import { SoftwareDevelopmentOsUltimateController } from './software-development-os-ultimate.controller';
import { SoftwareDevelopmentOsUltimateOrchestratorService } from './software-development-os-ultimate-orchestrator.service';

@Module({
  imports: [
    StrategyPlanningModule,
    EngineeringArchitectureModule,
    MultiAgentSoftwareOrganizationModule,
    DevelopmentTestingIntelligenceModule,
    EnterpriseDeliveryIntelligenceModule,
    EnterpriseKnowledgeMemoryModule,
    GovernanceComplianceModule,
    FinalCertificationModule,
    ContinuousEvolutionIntelligenceModule,
  ],
  controllers: [SoftwareDevelopmentOsUltimateController],
  providers: [SoftwareDevelopmentOsUltimateOrchestratorService],
  exports: [SoftwareDevelopmentOsUltimateOrchestratorService],
})
export class SoftwareDevelopmentOsUltimateModule {}
