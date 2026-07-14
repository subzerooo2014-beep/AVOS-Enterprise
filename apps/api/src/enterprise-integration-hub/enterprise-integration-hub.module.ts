import { Module } from "@nestjs/common";
import { EnterpriseIntegrationHubController } from "./enterprise-integration-hub.controller";
import { EnterpriseIntegrationHubService } from "./enterprise-integration-hub.service";

import { ConnectorRegistryService } from "./services/connector-registry.service";
import { IntegrationExecutionService } from "./services/integration-execution.service";
import { IntegrationSchedulerService } from "./services/integration-scheduler.service";
import { IntegrationRetryService } from "./services/integration-retry.service";
import { IntegrationMappingService } from "./services/integration-mapping.service";
import { IntegrationTransformationService } from "./services/integration-transformation.service";
import { IntegrationSecurityService } from "./services/integration-security.service";
import { IntegrationMonitoringService } from "./services/integration-monitoring.service";
import { IntegrationMarketplaceService } from "./services/integration-marketplace.service";
import { ConnectorCertificationService } from "./services/connector-certification.service";
import { ConnectorInstallerService } from "./services/connector-installer.service";
import { ConnectorLifecycleService } from "./services/connector-lifecycle.service";
import { ProviderCredentialService } from "./services/provider-credential.service";
import { WebhookSubscriptionService } from "./services/webhook-subscription.service";
import { IntegrationReportingService } from "./services/integration-reporting.service";
import { IntegrationAlertService } from "./services/integration-alert.service";
import { IntegrationAuditService } from "./services/integration-audit.service";
import { IntegrationHealthService } from "./services/integration-health.service";
import { IntegrationDashboardService } from "./services/integration-dashboard.service";

import { ErpConnector } from "./connectors/erp.connector";
import { CrmConnector } from "./connectors/crm.connector";
import { BankingConnector } from "./connectors/banking.connector";
import { GovernmentConnector } from "./connectors/government.connector";
import { IotConnector } from "./connectors/iot.connector";
import { MessagingConnector } from "./connectors/messaging.connector";
import { PaymentConnector } from "./connectors/payment.connector";
import { AiProviderConnector } from "./connectors/ai-provider.connector";
import { ShippingConnector } from "./connectors/shipping.connector";
import { InsuranceConnector } from "./connectors/insurance.connector";
import { InspectionConnector } from "./connectors/inspection.connector";
import { IdentityConnector } from "./connectors/identity.connector";

import { IntegrationRuntime } from "./runtime/integration.runtime";
import { SchedulerRuntime } from "./runtime/scheduler.runtime";
import { RetryRuntime } from "./runtime/retry.runtime";
import { MappingRuntime } from "./runtime/mapping.runtime";
import { TransformationRuntime } from "./runtime/transformation.runtime";
import { SecurityRuntime } from "./runtime/security.runtime";
import { MonitoringRuntime } from "./runtime/monitoring.runtime";
import { FailoverRuntime } from "./runtime/failover.runtime";

@Module({
  controllers:[EnterpriseIntegrationHubController],
  providers:[
    EnterpriseIntegrationHubService,
    ConnectorRegistryService,IntegrationExecutionService,IntegrationSchedulerService,IntegrationRetryService,
    IntegrationMappingService,IntegrationTransformationService,IntegrationSecurityService,IntegrationMonitoringService,
    IntegrationMarketplaceService,ConnectorCertificationService,ConnectorInstallerService,ConnectorLifecycleService,
    ProviderCredentialService,WebhookSubscriptionService,IntegrationReportingService,IntegrationAlertService,
    IntegrationAuditService,IntegrationHealthService,IntegrationDashboardService,
    ErpConnector,CrmConnector,BankingConnector,GovernmentConnector,IotConnector,MessagingConnector,
    PaymentConnector,AiProviderConnector,ShippingConnector,InsuranceConnector,InspectionConnector,IdentityConnector,
    IntegrationRuntime,SchedulerRuntime,RetryRuntime,MappingRuntime,TransformationRuntime,SecurityRuntime,MonitoringRuntime,FailoverRuntime
  ],
  exports:[EnterpriseIntegrationHubService],
})
export class EnterpriseIntegrationHubModule {}
