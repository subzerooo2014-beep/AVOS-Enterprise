import { Injectable } from '@nestjs/common';
import {
  ApiGatewayRoute,
  FederatedEvent,
  FederationNode,
  IntegrationConnector,
  IntegrationPolicy,
  SyncRecord,
} from './enterprise-integration-federation.types';
import { EnterpriseIntegrationHubService } from './enterprise-integration-hub.service';
import { UniversalConnectorFrameworkService } from './universal-connector-framework.service';
import { FederationManagementEngineService } from './federation-management-engine.service';
import { CrossPlatformSynchronizationEngineService } from './cross-platform-synchronization-engine.service';
import { EnterpriseApiGatewayIntelligenceService } from './enterprise-api-gateway-intelligence.service';
import { EnterpriseEventFederationService } from './enterprise-event-federation.service';
import { MultiCloudIntegrationCoordinatorService } from './multi-cloud-integration-coordinator.service';
import { ExternalSystemTrustManagerService } from './external-system-trust-manager.service';
import { EnterpriseIntegrationSecurityLayerService } from './enterprise-integration-security-layer.service';
import { IntegrationPolicyEngineService } from './integration-policy-engine.service';
import { FederationHealthMonitorService } from './federation-health-monitor.service';
import { GlobalConnectivityCenterService } from './global-connectivity-center.service';

@Injectable()
export class EnterpriseIntegrationFederationOrchestratorService {
  constructor(
    private readonly hub: EnterpriseIntegrationHubService,
    private readonly connectorFramework: UniversalConnectorFrameworkService,
    private readonly federation: FederationManagementEngineService,
    private readonly synchronization: CrossPlatformSynchronizationEngineService,
    private readonly gateway: EnterpriseApiGatewayIntelligenceService,
    private readonly events: EnterpriseEventFederationService,
    private readonly cloud: MultiCloudIntegrationCoordinatorService,
    private readonly trust: ExternalSystemTrustManagerService,
    private readonly security: EnterpriseIntegrationSecurityLayerService,
    private readonly policy: IntegrationPolicyEngineService,
    private readonly federationHealth: FederationHealthMonitorService,
    private readonly connectivity: GlobalConnectivityCenterService,
  ) {}

  run(input: {
    connectors: IntegrationConnector[];
    nodes: FederationNode[];
    syncRecords: SyncRecord[];
    routes: ApiGatewayRoute[];
    events: FederatedEvent[];
    policies: IntegrationPolicy[];
  }) {
    for (const connector of input.connectors) {
      this.hub.register(connector);
      this.connectivity.register(connector);
    }

    return {
      hub: this.hub.summary(),
      adapters: input.connectors.map((connector) =>
        this.connectorFramework.createAdapter(connector),
      ),
      federation: this.federation.manage(input.nodes),
      synchronization: this.synchronization.analyze(input.syncRecords),
      gateway: this.gateway.analyze(input.routes),
      events: this.events.federate(input.events),
      cloud: this.cloud.coordinate(input.connectors),
      trust: this.trust.evaluate(input.connectors, input.nodes),
      security: this.security.assess(input.connectors, input.routes),
      policy: this.policy.evaluate(input.connectors, input.policies),
      federationHealth: this.federationHealth.monitor(input.nodes),
      connectivity: this.connectivity.summary(),
    };
  }
}