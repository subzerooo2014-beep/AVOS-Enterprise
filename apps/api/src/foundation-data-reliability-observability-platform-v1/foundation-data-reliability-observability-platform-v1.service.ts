import { Injectable } from "@nestjs/common";
import { FoundationBackupRestoreV1Service } from "./foundation-backup-restore-v1.service";
import { FoundationCachePerformanceV1Service } from "./foundation-cache-performance-v1.service";
import { FoundationFilesMediaV1Service } from "./foundation-files-media-v1.service";
import { FoundationLoggingV1Service } from "./foundation-logging-v1.service";
import { FoundationMetricsV1Service } from "./foundation-metrics-v1.service";
import { FoundationSearchIndexV1Service } from "./foundation-search-index-v1.service";
import { FoundationSelfValidationV1Service } from "./foundation-self-validation-v1.service";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import { FoundationTracingV1Service } from "./foundation-tracing-v1.service";
import type {
  FoundationReliabilityMetricsV1,
  FoundationReliabilityStatusV1,
} from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationDataReliabilityObservabilityPlatformV1Service {
  constructor(
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

  metrics(): FoundationReliabilityMetricsV1 {
    return {
      storageObjects: this.storage.count(),
      backups: this.backups.count(),
      verifiedBackups: this.backups.verifiedCount(),
      mediaAssets: this.media.count(),
      searchDocuments: this.search.count(),
      cacheEntries: this.cache.count(),
      logs: this.logging.count(),
      errorLogs: this.logging.errorCount(),
      metrics: this.metricsService.count(),
      traces: this.tracing.count(),
      validationChecks: this.validation.count(),
      failedValidations: this.validation.failedCount(),
    };
  }

  status(): FoundationReliabilityStatusV1 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Foundation Data, Reliability & Observability Platform V1",
      version: "1.0.0",
      status:
        metrics.errorLogs > 0 || metrics.failedValidations > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        storage: "READY",
        backupRestore: "READY",
        filesMedia: "READY",
        searchIndexing: "READY",
        cachePerformance: "READY",
        logs: "READY",
        metrics: "READY",
        traces: "READY",
        observability: "READY",
        selfValidation: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      status: this.status(),
      storage: this.storage.list(),
      backups: this.backups.list(),
      media: this.media.list(),
      searchDocuments: this.search.list(),
      logs: this.logging.list(),
      metrics: this.metricsService.list(),
      traces: this.tracing.list(),
      validation: this.validation.list(),
    };
  }
}
