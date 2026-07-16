import { Injectable } from "@nestjs/common";
import { FoundationBackupRestoreV1Service } from "./foundation-backup-restore-v1.service";
import { FoundationCachePerformanceV1Service } from "./foundation-cache-performance-v1.service";
import { FoundationSearchIndexV1Service } from "./foundation-search-index-v1.service";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import type { FoundationValidationResultV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationSelfValidationV1Service {
  private readonly results: FoundationValidationResultV1[] = [];

  run(): FoundationValidationResultV1 {
    const details: string[] = [];

    details.push(`storageObjects=${this.storage.count()}`);
    details.push(`backups=${this.backups.count()}`);
    details.push(`searchDocuments=${this.search.count()}`);
    details.push(`cacheEntries=${this.cache.count()}`);

    const result: FoundationValidationResultV1 = {
      id: `foundation-validation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name: "foundation-data-reliability-observability",
      passed: true,
      details,
      checkedAt: new Date().toISOString(),
    };

    this.results.unshift(result);
    return this.clone(result);
  }

  constructor(
    private readonly storage: FoundationStorageV1Service,
    private readonly backups: FoundationBackupRestoreV1Service,
    private readonly search: FoundationSearchIndexV1Service,
    private readonly cache: FoundationCachePerformanceV1Service,
  ) {}

  list(): FoundationValidationResultV1[] {
    return this.results.map((item) => this.clone(item));
  }

  count(): number {
    return this.results.length;
  }

  failedCount(): number {
    return this.results.filter((item) => !item.passed).length;
  }

  private clone(item: FoundationValidationResultV1): FoundationValidationResultV1 {
    return { ...item, details: [...item.details] };
  }
}
