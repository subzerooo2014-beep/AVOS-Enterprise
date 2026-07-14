import { Injectable } from '@nestjs/common';
import {
  ApiEndpointProfile,
  EcosystemPartner,
  ExternalSignal,
  FederationMember,
  MarketplaceOpportunity,
} from './global-ecosystem-intelligence.types';
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
import { GlobalEcosystemCommandCenterService } from './global-ecosystem-command-center.service';

@Injectable()
export class GlobalEcosystemOrchestratorService {
  constructor(
    private readonly ecosystem: GlobalEcosystemIntelligenceEngineService,
    private readonly partners: EnterprisePartnerIntelligenceService,
    private readonly collaboration: CrossOrganizationCollaborationEngineService,
    private readonly integration: GlobalIntegrationOrchestratorService,
    private readonly external: ExternalIntelligenceFusionEngineService,
    private readonly api: EnterpriseApiIntelligenceHubService,
    private readonly marketplace: MarketplaceIntelligenceCoordinatorService,
    private readonly federation: EnterpriseFederationEngineService,
    private readonly trust: GlobalTrustIdentityIntelligenceService,
    private readonly lifecycle: AutonomousPartnerLifecycleManagerService,
    private readonly commandCenter: GlobalEcosystemCommandCenterService,
  ) {}

  run(input: {
    partners: EcosystemPartner[];
    signals: ExternalSignal[];
    endpoints: ApiEndpointProfile[];
    opportunities: MarketplaceOpportunity[];
    members: FederationMember[];
    collaborationObjective: string;
  }) {
    for (const partner of input.partners) {
      this.commandCenter.register(partner);
    }

    return {
      ecosystem: this.ecosystem.analyze(input.partners, input.signals),
      partners: this.partners.evaluate(input.partners),
      collaboration: this.collaboration.coordinate(
        input.partners,
        input.collaborationObjective,
      ),
      integration: this.integration.orchestrate(
        input.partners,
        input.endpoints,
      ),
      external: this.external.fuse(input.signals),
      api: this.api.analyze(input.endpoints),
      marketplace: this.marketplace.rank(input.opportunities),
      federation: this.federation.federate(input.members),
      trust: this.trust.evaluate(input.partners, input.members),
      lifecycle: this.lifecycle.plan(input.partners),
      commandCenter: this.commandCenter.summary(),
    };
  }
}