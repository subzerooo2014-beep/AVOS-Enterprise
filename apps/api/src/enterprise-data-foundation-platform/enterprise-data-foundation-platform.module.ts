import { Module } from "@nestjs/common";
import { AnalyticsEngineService } from "./analytics-engine.service";
import { DataCatalogService } from "./data-catalog.service";
import { DataGovernanceService } from "./data-governance.service";
import { DataLineageService } from "./data-lineage.service";
import { DataQualityService } from "./data-quality.service";
import { EnterpriseDataFoundationPlatformController } from "./enterprise-data-foundation-platform.controller";
import { EnterpriseDataFoundationPlatformService } from "./enterprise-data-foundation-platform.service";
import { EtlRuntimeService } from "./etl-runtime.service";
import { EventAnalyticsService } from "./event-analytics.service";
import { TimeSeriesStoreService } from "./time-series-store.service";

@Module({
  controllers: [EnterpriseDataFoundationPlatformController],
  providers: [
    AnalyticsEngineService,
    DataCatalogService,
    DataGovernanceService,
    DataLineageService,
    DataQualityService,
    EnterpriseDataFoundationPlatformService,
    EtlRuntimeService,
    EventAnalyticsService,
    TimeSeriesStoreService,
  ],
  exports: [
    AnalyticsEngineService,
    DataCatalogService,
    DataGovernanceService,
    DataLineageService,
    DataQualityService,
    EnterpriseDataFoundationPlatformService,
    EtlRuntimeService,
    EventAnalyticsService,
    TimeSeriesStoreService,
  ],
})
export class EnterpriseDataFoundationPlatformModule {}
