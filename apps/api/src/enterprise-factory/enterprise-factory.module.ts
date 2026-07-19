import { Module } from '@nestjs/common';
import { EnterpriseFactoryController } from './enterprise-factory.controller';
import { EnterpriseFactoryOrchestratorService } from './enterprise-factory-orchestrator.service';
import { EnterpriseFactoryStore } from './enterprise-factory.store';
import { EnterpriseFactoryFoundationService } from './mega-pack-1-enterprise-factory-foundation.service';
import { EnterprisePortfolioResourceManagerService } from './mega-pack-2-portfolio-resource-manager.service';
import { EnterpriseOrchestratorService } from './mega-pack-3-enterprise-orchestrator.service';
import { MultiFactoryRuntimeService } from './mega-pack-4-multi-factory-runtime.service';
import { EnterpriseAiPlanningEngineService } from './mega-pack-5-enterprise-ai-planning-engine.service';
import { EnterpriseDeploymentCenterService } from './mega-pack-6-enterprise-deployment-center.service';
import { EnterpriseCertificationAuthorityService } from './mega-pack-7-enterprise-certification-authority.service';
import { EnterpriseFactoryFinalIntegrationCertificationService } from './mega-pack-8-final-integration-certification.service';

@Module({
  controllers: [EnterpriseFactoryController],
  providers: [
    EnterpriseFactoryStore,
    EnterpriseFactoryFoundationService,
    EnterprisePortfolioResourceManagerService,
    EnterpriseOrchestratorService,
    MultiFactoryRuntimeService,
    EnterpriseAiPlanningEngineService,
    EnterpriseDeploymentCenterService,
    EnterpriseCertificationAuthorityService,
    EnterpriseFactoryFinalIntegrationCertificationService,
    EnterpriseFactoryOrchestratorService,
  ],
  exports: [
    EnterpriseFactoryFoundationService,
    EnterprisePortfolioResourceManagerService,
    EnterpriseOrchestratorService,
    MultiFactoryRuntimeService,
    EnterpriseAiPlanningEngineService,
    EnterpriseDeploymentCenterService,
    EnterpriseCertificationAuthorityService,
    EnterpriseFactoryFinalIntegrationCertificationService,
    EnterpriseFactoryOrchestratorService,
  ],
})
export class EnterpriseFactoryModule {}