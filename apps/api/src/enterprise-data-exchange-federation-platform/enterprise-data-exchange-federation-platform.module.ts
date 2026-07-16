import { Module } from "@nestjs/common";
import { DataContractRegistryService } from "./data-contract-registry.service";
import { DataExchangeHubService } from "./data-exchange-hub.service";
import { DataMappingEngineService } from "./data-mapping-engine.service";
import { DataSynchronizationService } from "./data-synchronization.service";
import { EnterpriseDataExchangeFederationPlatformController } from "./enterprise-data-exchange-federation-platform.controller";
import { FederationAnalyticsService } from "./federation-analytics.service";
import { FederationLineageService } from "./federation-lineage.service";
import { FederationNodeRegistryService } from "./federation-node-registry.service";
import { FederationQualityMonitorService } from "./federation-quality-monitor.service";
import { SchemaRegistryService } from "./schema-registry.service";

@Module({
  controllers: [EnterpriseDataExchangeFederationPlatformController],
  providers: [
    DataContractRegistryService,
    DataExchangeHubService,
    DataMappingEngineService,
    DataSynchronizationService,
    FederationAnalyticsService,
    FederationLineageService,
    FederationNodeRegistryService,
    FederationQualityMonitorService,
    SchemaRegistryService,
  ],
  exports: [
    DataContractRegistryService,
    DataExchangeHubService,
    DataMappingEngineService,
    DataSynchronizationService,
    FederationAnalyticsService,
    FederationLineageService,
    FederationNodeRegistryService,
    FederationQualityMonitorService,
    SchemaRegistryService,
  ],
})
export class EnterpriseDataExchangeFederationPlatformModule {}
