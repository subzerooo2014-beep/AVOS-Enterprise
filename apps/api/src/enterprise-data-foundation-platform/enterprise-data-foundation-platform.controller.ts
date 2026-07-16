import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AnalyticsEngineService } from "./analytics-engine.service";
import { DataCatalogService } from "./data-catalog.service";
import { DataLineageService } from "./data-lineage.service";
import { DataQualityService } from "./data-quality.service";
import { EnterpriseDataFoundationPlatformService } from "./enterprise-data-foundation-platform.service";
import { EtlRuntimeService } from "./etl-runtime.service";
import { EventAnalyticsService } from "./event-analytics.service";
import { TimeSeriesStoreService } from "./time-series-store.service";
import type {
  DataAssetRecord,
  DataLineageRecord,
  DataQualityRuleRecord,
  EtlPipelineRecord,
} from "./enterprise-data-foundation.types";

@Controller("enterprise-data-foundation-platform")
export class EnterpriseDataFoundationPlatformController {
  constructor(
    private readonly platform: EnterpriseDataFoundationPlatformService,
    private readonly catalog: DataCatalogService,
    private readonly lineage: DataLineageService,
    private readonly quality: DataQualityService,
    private readonly etl: EtlRuntimeService,
    private readonly timeSeries: TimeSeriesStoreService,
    private readonly events: EventAnalyticsService,
    private readonly analytics: AnalyticsEngineService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("assets")
  upsertAsset(
    @Body()
    body: Omit<DataAssetRecord, "version" | "createdAt" | "updatedAt">,
  ) {
    return { success: true, asset: this.catalog.upsert(body) };
  }

  @Post("lineage")
  connectLineage(
    @Body()
    body: Omit<DataLineageRecord, "id" | "createdAt"> & { id?: string },
  ) {
    return { success: true, lineage: this.lineage.connect(body) };
  }

  @Post("quality-rules")
  registerQualityRule(@Body() body: DataQualityRuleRecord) {
    return { success: true, rule: this.quality.registerRule(body) };
  }

  @Post("quality-rules/:id/check")
  checkQuality(
    @Param("id") id: string,
    @Body() body: { rows: Record<string, unknown>[] },
  ) {
    return {
      success: true,
      result: this.quality.check(id, body.rows),
    };
  }

  @Post("pipelines")
  registerPipeline(
    @Body() body: Omit<EtlPipelineRecord, "version">,
  ) {
    return { success: true, pipeline: this.etl.registerPipeline(body) };
  }

  @Post("pipelines/:id/execute")
  executePipeline(
    @Param("id") id: string,
    @Body()
    body: {
      recordsRead: number;
      recordsWritten: number;
      error?: string;
    },
  ) {
    return {
      success: true,
      execution: this.etl.execute(
        id,
        body.recordsRead,
        body.recordsWritten,
        body.error,
      ),
    };
  }

  @Post("time-series")
  writeTimeSeries(
    @Body()
    body: {
      metric: string;
      value: number;
      labels?: Record<string, string>;
      timestamp?: string;
    },
  ) {
    return {
      success: true,
      point: this.timeSeries.write(
        body.metric,
        body.value,
        body.labels,
        body.timestamp,
      ),
    };
  }

  @Get("time-series")
  queryTimeSeries(
    @Query("metric") metric: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    return {
      success: true,
      items: this.timeSeries.query(metric, from, to),
      aggregate: this.timeSeries.aggregate(metric),
    };
  }

  @Post("events")
  ingestEvent(
    @Body()
    body: {
      type: string;
      source: string;
      payload: Record<string, unknown>;
      occurredAt?: string;
    },
  ) {
    return {
      success: true,
      event: this.events.ingest(
        body.type,
        body.source,
        body.payload,
        body.occurredAt,
      ),
    };
  }

  @Get("analytics")
  analyticsSnapshot() {
    return {
      success: true,
      analytics: this.analytics.snapshot(),
    };
  }
}
