import { Module } from '@nestjs/common';
import { GlobalEcosystemIntelligenceController } from './global-ecosystem-intelligence.controller';
import { GlobalEcosystemIntelligenceEngineService } from './global-ecosystem-intelligence-engine.service';
import { EnterprisePartnerIntelligenceService } from './enterprise-partner-intelligence.service';
import { CrossOrganizationCollaborationEngineService } from './cross-organization-collaboration-engine.service';
import { GlobalIntegrationOrchestratorService } from './global-integration-orchestrator.service';
import { ExternalIntelligenceFusionEngineService } from './external-intelligence-fusion-engine.service';
import { EnterpriseApiIntelligenceHubService } from './enterprise-api-intelligence-hub.service';
import { MarketplaceIntelligenceCoordinatorService } from './marketplace-intelligence-coordinator.service';
import { EnterpriseFederationEngineService } from './enterprise-federation-engine.service';
import { GlobalTrustIdentityIntelligenceService } from './global-trust-identity-intelligence.service';
import { AutonomousPartnerLifecycleManagerService } from './autonomous-partner-lifecycle-manager.service';
import { GlobalEcosystemOrchestratorService } from './global-ecosystem-orchestrator.service';
import { EcosystemIntelligenceDashboardService } from './ecosystem-intelligence-dashboard.service';
import { GlobalEcosystemCommandCenterService } from './global-ecosystem-command-center.service';

@Module({
  controllers: [GlobalEcosystemIntelligenceController],
  providers: [
    GlobalEcosystemIntelligenceEngineService,
    EnterprisePartnerIntelligenceService,
    CrossOrganizationCollaborationEngineService,
    GlobalIntegrationOrchestratorService,
    ExternalIntelligenceFusionEngineService,
    EnterpriseApiIntelligenceHubService,
    MarketplaceIntelligenceCoordinatorService,
    EnterpriseFederationEngineService,
    GlobalTrustIdentityIntelligenceService,
    AutonomousPartnerLifecycleManagerService,
    GlobalEcosystemOrchestratorService,
    EcosystemIntelligenceDashboardService,
    GlobalEcosystemCommandCenterService,
  ],
  exports: [
    GlobalEcosystemIntelligenceEngineService,
    EnterprisePartnerIntelligenceService,
    CrossOrganizationCollaborationEngineService,
    GlobalIntegrationOrchestratorService,
    ExternalIntelligenceFusionEngineService,
    EnterpriseApiIntelligenceHubService,
    MarketplaceIntelligenceCoordinatorService,
    EnterpriseFederationEngineService,
    GlobalTrustIdentityIntelligenceService,
    AutonomousPartnerLifecycleManagerService,
    GlobalEcosystemOrchestratorService,
    EcosystemIntelligenceDashboardService,
    GlobalEcosystemCommandCenterService,
  ],
})
export class GlobalEcosystemIntelligenceModule {}