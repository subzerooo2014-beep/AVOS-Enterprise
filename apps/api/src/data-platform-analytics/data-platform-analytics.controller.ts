import { Body, Controller, Get, Post } from "@nestjs/common";
import { DataPlatformAnalyticsService } from "./data-platform-analytics.service";
import { DataSourceService } from "./services/data-source.service";
import { DataAssetService } from "./services/data-asset.service";
import { DataPipelineService } from "./services/data-pipeline.service";
import { DataCatalogService } from "./services/data-catalog.service";
import { DataQualityService } from "./services/data-quality.service";
import { DataLineageService } from "./services/data-lineage.service";
import { MasterDataService } from "./services/master-data.service";
import { KpiService } from "./services/kpi.service";
import { DashboardService } from "./services/dashboard.service";
import { ReportingService } from "./services/reporting.service";
import { AnalyticsDashboardService } from "./services/analytics-dashboard.service";
import { PredictiveAnalyticsEngine } from "./ai/predictive-analytics.engine";
import { AnalyticsAnomalyDetectionEngine } from "./ai/anomaly-detection.engine";
import { Customer360Engine } from "./ai/customer-360.engine";
import { Vehicle360Engine } from "./ai/vehicle-360.engine";
import { Partner360Engine } from "./ai/partner-360.engine";
import { AiInsightsEngine } from "./ai/ai-insights.engine";
import { KpiIntelligenceEngine } from "./ai/kpi-intelligence.engine";
import { DataQualityAiEngine } from "./ai/data-quality-ai.engine";

@Controller("data-platform-analytics")
export class DataPlatformAnalyticsController {
  constructor(
    private readonly os: DataPlatformAnalyticsService,
    private readonly sources: DataSourceService,
    private readonly assets: DataAssetService,
    private readonly pipelines: DataPipelineService,
    private readonly catalog: DataCatalogService,
    private readonly quality: DataQualityService,
    private readonly lineage: DataLineageService,
    private readonly mdm: MasterDataService,
    private readonly kpis: KpiService,
    private readonly dashboards: DashboardService,
    private readonly reports: ReportingService,
    private readonly operations: AnalyticsDashboardService,
    private readonly predictive: PredictiveAnalyticsEngine,
    private readonly anomaly: AnalyticsAnomalyDetectionEngine,
    private readonly customer360: Customer360Engine,
    private readonly vehicle360: Vehicle360Engine,
    private readonly partner360: Partner360Engine,
    private readonly insights: AiInsightsEngine,
    private readonly kpiAi: KpiIntelligenceEngine,
    private readonly qualityAi: DataQualityAiEngine,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("data-sources") createSource(@Body() body:any){ return {success:true,source:this.sources.create(body)}; }
  @Post("data-assets") createAsset(@Body() body:any){ return {success:true,asset:this.assets.create(body)}; }
  @Post("pipelines") createPipeline(@Body() body:any){ return {success:true,pipeline:this.pipelines.create(body)}; }
  @Post("catalog") createCatalog(@Body() body:any){ return {success:true,catalog:this.catalog.create(body)}; }
  @Post("quality") createQuality(@Body() body:any){ return {success:true,quality:this.quality.create(body)}; }
  @Post("lineage") createLineage(@Body() body:any){ return {success:true,lineage:this.lineage.create(body)}; }
  @Post("mdm") createMdm(@Body() body:any){ return {success:true,record:this.mdm.create(body)}; }
  @Post("kpis") createKpi(@Body() body:any){ return {success:true,kpi:this.kpis.create(body)}; }
  @Post("dashboards") createDashboard(@Body() body:any){ return {success:true,dashboard:this.dashboards.create(body)}; }
  @Post("reports") createReport(@Body() body:any){ return {success:true,report:this.reports.create(body)}; }
  @Post("ai/predictive") predictiveAnalytics(@Body() body:any){ return this.predictive.forecast(body.values??[]); }
  @Post("ai/anomaly") anomalyDetection(@Body() body:any){ return this.anomaly.detect(body.values??[]); }
  @Post("ai/customer-360") customerProfile(@Body() body:any){ return this.customer360.build(body); }
  @Post("ai/vehicle-360") vehicleProfile(@Body() body:any){ return this.vehicle360.build(body); }
  @Post("ai/partner-360") partnerProfile(@Body() body:any){ return this.partner360.build(body); }
  @Post("ai/insights") aiInsights(@Body() body:any){ return this.insights.generate(body); }
  @Post("ai/kpi") kpiIntelligence(@Body() body:any){ return this.kpiAi.evaluate(body.target,body.actual); }
  @Post("ai/data-quality") dataQualityAi(@Body() body:any){ return this.qualityAi.score(body); }
  @Get("operations/dashboard") dashboard(){ return {success:true,dashboard:this.operations.summary()}; }
}
