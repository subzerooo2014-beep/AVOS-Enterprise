import { Injectable } from "@nestjs/common";
import { DataContractRegistryService } from "./data-contract-registry.service";
import { DataExchangeHubService } from "./data-exchange-hub.service";
import { DataMappingEngineService } from "./data-mapping-engine.service";
import { DataSynchronizationService } from "./data-synchronization.service";
import { FederationLineageService } from "./federation-lineage.service";
import { FederationNodeRegistryService } from "./federation-node-registry.service";
import { FederationQualityMonitorService } from "./federation-quality-monitor.service";
import { SchemaRegistryService } from "./schema-registry.service";
import type {
  FederationHealth,
  FederationMetrics,
} from "./enterprise-data-exchange-federation.types";

@Injectable()
export class FederationAnalyticsService {
  constructor(
    private readonly nodes: FederationNodeRegistryService,
    private readonly contracts: DataContractRegistryService,
    private readonly schemas: SchemaRegistryService,
    private readonly mappings: DataMappingEngineService,
    private readonly exchange: DataExchangeHubService,
    private readonly sync: DataSynchronizationService,
    private readonly lineage: FederationLineageService,
    private readonly quality: FederationQualityMonitorService,
  ) {}

  metrics(): FederationMetrics {
    return {
      nodes: this.nodes.count(),
      activeNodes: this.nodes.activeCount(),
      contracts: this.contracts.count(),
      activeContracts: this.contracts.activeCount(),
      schemas: this.schemas.count(),
      mappings: this.mappings.count(),
      messages: this.exchange.count(),
      deliveredMessages: this.exchange.deliveredCount(),
      failedMessages: this.exchange.failedCount(),
      synchronizations: this.sync.count(),
      failedSynchronizations: this.sync.failedCount(),
      lineageRecords: this.lineage.count(),
      qualityChecks: this.quality.count(),
      qualityFailures: this.quality.failureCount(),
    };
  }

  health(): FederationHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Data Exchange & Federation Platform",
      version: "1.0.0",
      status:
        metrics.failedMessages > 0 ||
        metrics.failedSynchronizations > 0 ||
        metrics.qualityFailures > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        federationRegistry: "READY",
        schemaRegistry: "READY",
        dataContracts: "READY",
        mappingEngine: "READY",
        dataExchangeHub: "READY",
        dataSynchronization: "READY",
        federationLineage: "READY",
        federationQualityMonitor: "READY",
        federationAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      nodes: this.nodes.list(),
      schemas: this.schemas.list(),
      contracts: this.contracts.list(),
      mappings: this.mappings.list(),
      messages: this.exchange.list(),
      synchronizations: this.sync.list(),
      lineage: this.lineage.list(),
      quality: this.quality.list(),
    };
  }
}
