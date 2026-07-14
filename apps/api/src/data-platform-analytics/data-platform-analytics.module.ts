import { Module } from "@nestjs/common";
import { DataPlatformAnalyticsController } from "./data-platform-analytics.controller";
import { DataPlatformAnalyticsService } from "./data-platform-analytics.service";
import { DataSourceService } from "./services/data-source.service";
import { DataAssetService } from "./services/data-asset.service";
import { DataLakeService } from "./services/data-lake.service";
import { DataWarehouseService } from "./services/data-warehouse.service";
import { DataCatalogService } from "./services/data-catalog.service";
import { MetadataRegistryService } from "./services/metadata-registry.service";
import { DataPipelineService } from "./services/data-pipeline.service";
import { StreamAnalyticsService } from "./services/stream-analytics.service";
import { EventAnalyticsService } from "./services/event-analytics.service";
import { Customer360Service } from "./services/customer-360.service";
import { Vehicle360Service } from "./services/vehicle-360.service";
import { Partner360Service } from "./services/partner-360.service";
import { DataQualityService } from "./services/data-quality.service";
import { DataLineageService } from "./services/data-lineage.service";
import { MasterDataService } from "./services/master-data.service";
import { KpiService } from "./services/kpi.service";
import { DashboardService } from "./services/dashboard.service";
import { ReportingService } from "./services/reporting.service";
import { TimeseriesService } from "./services/timeseries.service";
import { SearchIndexService } from "./services/search-index.service";
import { DataGovernanceService } from "./services/data-governance.service";
import { AnalyticsQueryService } from "./services/analytics-query.service";
import { AnalyticsDashboardService } from "./services/analytics-dashboard.service";
import { AnalyticsAuditService } from "./services/analytics-audit.service";
import { PredictiveAnalyticsEngine } from "./ai/predictive-analytics.engine";
import { AnalyticsAnomalyDetectionEngine } from "./ai/anomaly-detection.engine";
import { Customer360Engine } from "./ai/customer-360.engine";
import { Vehicle360Engine } from "./ai/vehicle-360.engine";
import { Partner360Engine } from "./ai/partner-360.engine";
import { AiInsightsEngine } from "./ai/ai-insights.engine";
import { KpiIntelligenceEngine } from "./ai/kpi-intelligence.engine";
import { DataQualityAiEngine } from "./ai/data-quality-ai.engine";
import { EtlPipeline } from "./pipelines/etl.pipeline";
import { EltPipeline } from "./pipelines/elt.pipeline";
import { StreamProcessingPipeline } from "./pipelines/stream-processing.pipeline";
import { BatchProcessingPipeline } from "./pipelines/batch-processing.pipeline";
import { EventAnalyticsPipeline } from "./pipelines/event-analytics.pipeline";
import { TimeseriesPipeline } from "./pipelines/timeseries.pipeline";
import { SearchIndexPipeline } from "./pipelines/search-index.pipeline";
import { DataLakePipeline } from "./pipelines/data-lake.pipeline";

@Module({
  controllers:[DataPlatformAnalyticsController],
  providers:[
    DataPlatformAnalyticsService,
    DataSourceService,DataAssetService,DataLakeService,DataWarehouseService,DataCatalogService,MetadataRegistryService,
    DataPipelineService,StreamAnalyticsService,EventAnalyticsService,Customer360Service,Vehicle360Service,Partner360Service,
    DataQualityService,DataLineageService,MasterDataService,KpiService,DashboardService,ReportingService,TimeseriesService,
    SearchIndexService,DataGovernanceService,AnalyticsQueryService,AnalyticsDashboardService,AnalyticsAuditService,
    PredictiveAnalyticsEngine,AnalyticsAnomalyDetectionEngine,Customer360Engine,Vehicle360Engine,Partner360Engine,
    AiInsightsEngine,KpiIntelligenceEngine,DataQualityAiEngine,
    EtlPipeline,EltPipeline,StreamProcessingPipeline,BatchProcessingPipeline,EventAnalyticsPipeline,TimeseriesPipeline,
    SearchIndexPipeline,DataLakePipeline
  ],
  exports:[DataPlatformAnalyticsService],
})
export class DataPlatformAnalyticsModule {}
