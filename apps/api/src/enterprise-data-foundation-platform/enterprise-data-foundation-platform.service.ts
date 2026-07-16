import { Injectable } from "@nestjs/common";
import { AnalyticsEngineService } from "./analytics-engine.service";
import { DataCatalogService } from "./data-catalog.service";
import { DataGovernanceService } from "./data-governance.service";
import { DataLineageService } from "./data-lineage.service";
import { DataQualityService } from "./data-quality.service";
import { EtlRuntimeService } from "./etl-runtime.service";
import { EventAnalyticsService } from "./event-analytics.service";
import { TimeSeriesStoreService } from "./time-series-store.service";
import type {
  DataFoundationHealth,
  DataFoundationMetrics,
} from "./enterprise-data-foundation.types";

@Injectable()
export class EnterpriseDataFoundationPlatformService {
  constructor(
    private readonly catalog: DataCatalogService,
    private readonly lineage: DataLineageService,
    private readonly quality: DataQualityService,
    private readonly etl: EtlRuntimeService,
    private readonly timeSeries: TimeSeriesStoreService,
    private readonly events: EventAnalyticsService,
    private readonly analytics: AnalyticsEngineService,
    private readonly governance: DataGovernanceService,
  ) {}

  metrics(): DataFoundationMetrics {
    return {
      assets: this.catalog.count(),
      lineageLinks: this.lineage.count(),
      qualityRules: this.quality.ruleCount(),
      qualityChecks: this.quality.resultCount(),
      qualityFailures: this.quality.failureCount(),
      pipelines: this.etl.pipelineCount(),
      executions: this.etl.executionCount(),
      failedExecutions: this.etl.failedExecutionCount(),
      timeSeriesPoints: this.timeSeries.count(),
      events: this.events.count(),
    };
  }

  health(): DataFoundationHealth {
    const governance = this.governance.validate();
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Data Foundation Platform",
      version: "1.0.0",
      status:
        governance.compliant &&
        metrics.failedExecutions === 0 &&
        metrics.qualityFailures === 0
          ? "READY"
          : "DEGRADED",
      metrics,
      components: {
        dataCatalog: "READY",
        dataLineage: "READY",
        dataQuality: "READY",
        etlRuntime: "READY",
        analyticsEngine: "READY",
        timeSeriesStore: "READY",
        eventAnalytics: "READY",
        dataGovernance: governance.compliant ? "READY" : "DEGRADED",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      assets: this.catalog.list(),
      lineage: this.lineage.list(),
      qualityRules: this.quality.rulesList(),
      qualityResults: this.quality.resultsList(),
      pipelines: this.etl.pipelinesList(),
      executions: this.etl.executionsList(),
      eventSummary: this.events.summary(),
      analytics: this.analytics.snapshot(),
      governance: this.governance.validate(),
    };
  }
}
