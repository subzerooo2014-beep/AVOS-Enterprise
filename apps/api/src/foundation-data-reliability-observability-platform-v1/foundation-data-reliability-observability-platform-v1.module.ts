import { Module } from "@nestjs/common";
import { FoundationBackupRestoreV1Service } from "./foundation-backup-restore-v1.service";
import { FoundationCachePerformanceV1Service } from "./foundation-cache-performance-v1.service";
import { FoundationDataReliabilityObservabilityPlatformV1Controller } from "./foundation-data-reliability-observability-platform-v1.controller";
import { FoundationDataReliabilityObservabilityPlatformV1Service } from "./foundation-data-reliability-observability-platform-v1.service";
import { FoundationFilesMediaV1Service } from "./foundation-files-media-v1.service";
import { FoundationLoggingV1Service } from "./foundation-logging-v1.service";
import { FoundationMetricsV1Service } from "./foundation-metrics-v1.service";
import { FoundationSearchIndexV1Service } from "./foundation-search-index-v1.service";
import { FoundationSelfValidationV1Service } from "./foundation-self-validation-v1.service";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import { FoundationTracingV1Service } from "./foundation-tracing-v1.service";

@Module({
  controllers: [FoundationDataReliabilityObservabilityPlatformV1Controller],
  providers: [
    FoundationBackupRestoreV1Service,
    FoundationCachePerformanceV1Service,
    FoundationDataReliabilityObservabilityPlatformV1Service,
    FoundationFilesMediaV1Service,
    FoundationLoggingV1Service,
    FoundationMetricsV1Service,
    FoundationSearchIndexV1Service,
    FoundationSelfValidationV1Service,
    FoundationStorageV1Service,
    FoundationTracingV1Service,
  ],
  exports: [
    FoundationBackupRestoreV1Service,
    FoundationCachePerformanceV1Service,
    FoundationDataReliabilityObservabilityPlatformV1Service,
    FoundationFilesMediaV1Service,
    FoundationLoggingV1Service,
    FoundationMetricsV1Service,
    FoundationSearchIndexV1Service,
    FoundationSelfValidationV1Service,
    FoundationStorageV1Service,
    FoundationTracingV1Service,
  ],
})
export class FoundationDataReliabilityObservabilityPlatformV1Module {}
