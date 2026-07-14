import { Module } from '@nestjs/common';
import { EnterpriseIntegrationFederationController } from './enterprise-integration-federation.controller';
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
import { EnterpriseIntegrationFederationOrchestratorService } from './enterprise-integration-federation-orchestrator.service';
import { IntegrationIntelligenceDashboardService } from './integration-intelligence-dashboard.service';
import { GlobalConnectivityCenterService } from './global-connectivity-center.service';

@Module({
  controllers: [EnterpriseIntegrationFederationController],
  providers: [
    EnterpriseIntegrationHubService,
    UniversalConnectorFrameworkService,
    FederationManagementEngineService,
    CrossPlatformSynchronizationEngineService,
    EnterpriseApiGatewayIntelligenceService,
    EnterpriseEventFederationService,
    MultiCloudIntegrationCoordinatorService,
    ExternalSystemTrustManagerService,
    EnterpriseIntegrationSecurityLayerService,
    IntegrationPolicyEngineService,
    FederationHealthMonitorService,
    EnterpriseIntegrationFederationOrchestratorService,
    IntegrationIntelligenceDashboardService,
    GlobalConnectivityCenterService,
  ],
  exports: [
    EnterpriseIntegrationHubService,
    UniversalConnectorFrameworkService,
    FederationManagementEngineService,
    CrossPlatformSynchronizationEngineService,
    EnterpriseApiGatewayIntelligenceService,
    EnterpriseEventFederationService,
    MultiCloudIntegrationCoordinatorService,
    ExternalSystemTrustManagerService,
    EnterpriseIntegrationSecurityLayerService,
    IntegrationPolicyEngineService,
    FederationHealthMonitorService,
    EnterpriseIntegrationFederationOrchestratorService,
    IntegrationIntelligenceDashboardService,
    GlobalConnectivityCenterService,
  ],
})
export class EnterpriseIntegrationFederationModule {}