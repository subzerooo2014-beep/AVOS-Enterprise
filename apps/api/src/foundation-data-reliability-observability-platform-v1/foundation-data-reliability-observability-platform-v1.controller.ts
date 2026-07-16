import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationBackupRestoreV1Service } from "./foundation-backup-restore-v1.service";
import { FoundationCachePerformanceV1Service } from "./foundation-cache-performance-v1.service";
import { FoundationDataReliabilityObservabilityPlatformV1Service } from "./foundation-data-reliability-observability-platform-v1.service";
import { FoundationFilesMediaV1Service } from "./foundation-files-media-v1.service";
import { FoundationLoggingV1Service } from "./foundation-logging-v1.service";
import { FoundationMetricsV1Service } from "./foundation-metrics-v1.service";
import { FoundationSearchIndexV1Service } from "./foundation-search-index-v1.service";
import { FoundationSelfValidationV1Service } from "./foundation-self-validation-v1.service";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import { FoundationTracingV1Service } from "./foundation-tracing-v1.service";

@Controller("foundation-data-reliability-observability-platform-v1")
export class FoundationDataReliabilityObservabilityPlatformV1Controller {
  constructor(
    private readonly platform: FoundationDataReliabilityObservabilityPlatformV1Service,
    private readonly storage: FoundationStorageV1Service,
    private readonly backups: FoundationBackupRestoreV1Service,
    private readonly media: FoundationFilesMediaV1Service,
    private readonly search: FoundationSearchIndexV1Service,
    private readonly cache: FoundationCachePerformanceV1Service,
    private readonly logging: FoundationLoggingV1Service,
    private readonly metricsService: FoundationMetricsV1Service,
    private readonly tracing: FoundationTracingV1Service,
    private readonly validation: FoundationSelfValidationV1Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("storage")
  putStorage(
    @Body()
    body: {
      namespace: string;
      key: string;
      contentType: string;
      content: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      object: this.storage.put(
        body.namespace,
        body.key,
        body.contentType,
        body.content,
        body.metadata,
      ),
    };
  }

  @Post("backups")
  createBackup(@Body() body: { scope: string; objectIds: string[] }) {
    return { success: true, backup: this.backups.create(body.scope, body.objectIds) };
  }

  @Post("backups/:id/verify")
  verifyBackup(@Param("id") id: string) {
    return { success: true, backup: this.backups.verify(id) };
  }

  @Post("backups/:id/restore")
  restoreBackup(@Param("id") id: string) {
    return { success: true, backup: this.backups.restore(id) };
  }

  @Post("media")
  createMedia(
    @Body()
    body: {
      filename: string;
      mimeType: string;
      content: string;
      tags?: string[];
    },
  ) {
    return {
      success: true,
      asset: this.media.create(
        body.filename,
        body.mimeType,
        body.content,
        body.tags,
      ),
    };
  }

  @Post("search/index")
  indexDocument(
    @Body()
    body: {
      index: string;
      id: string;
      title: string;
      content: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      document: this.search.indexDocument(
        body.index,
        body.id,
        body.title,
        body.content,
        body.metadata,
      ),
    };
  }

  @Post("cache")
  setCache(@Body() body: { key: string; value: unknown; ttlSeconds?: number }) {
    return { success: true, entry: this.cache.set(body.key, body.value, body.ttlSeconds) };
  }

  @Post("logs")
  writeLog(
    @Body()
    body: {
      level: "DEBUG" | "INFO" | "WARN" | "ERROR";
      message: string;
      context?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      log: this.logging.write(body.level, body.message, body.context),
    };
  }

  @Post("metrics")
  recordMetric(
    @Body()
    body: {
      name: string;
      value: number;
      labels?: Record<string, string>;
    },
  ) {
    return {
      success: true,
      metric: this.metricsService.record(body.name, body.value, body.labels),
    };
  }

  @Post("traces/start")
  startTrace(
    @Body()
    body: {
      traceId: string;
      name: string;
      parentSpanId?: string;
      attributes?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      span: this.tracing.start(
        body.traceId,
        body.name,
        body.parentSpanId,
        body.attributes,
      ),
    };
  }

  @Post("validate")
  validate() {
    return { success: true, result: this.validation.run() };
  }
}
