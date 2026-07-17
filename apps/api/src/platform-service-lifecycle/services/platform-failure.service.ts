import { Injectable, NotFoundException } from "@nestjs/common";
import type { ServiceFailureRecord } from "../contracts/platform-service-lifecycle.contracts";
import type { RecordServiceFailureDto } from "../dto/platform-service-lifecycle.dto";
import { PlatformLifecycleIdService } from "./platform-lifecycle-id.service";
import { PlatformRuntimeRegistryService } from "./platform-runtime-registry.service";

@Injectable()
export class PlatformFailureService {
  private readonly failures: ServiceFailureRecord[] = [];

  constructor(
    private readonly ids: PlatformLifecycleIdService,
    private readonly runtime: PlatformRuntimeRegistryService
  ) {}

  record(serviceId: string, dto: RecordServiceFailureDto): ServiceFailureRecord {
    const current = this.runtime.get(serviceId);
    const failure: ServiceFailureRecord = {
      id: this.ids.create(),
      serviceId,
      code: dto.code,
      message: dto.message,
      severity: dto.severity,
      detectedAt: this.ids.now(),
      details: { ...(dto.details ?? {}) }
    };

    this.failures.push(failure);
    this.runtime.update(
      serviceId,
      dto.severity === "warning" ? "degraded" : "failed",
      { failureCount: current.failureCount + 1 }
    );

    return failure;
  }

  resolve(failureId: string): ServiceFailureRecord {
    const index = this.failures.findIndex((failure) => failure.id === failureId);
    if (index < 0) {
      throw new NotFoundException(`Failure record not found: ${failureId}`);
    }

    const current = this.failures[index];
    const resolved: ServiceFailureRecord = {
      ...current,
      resolvedAt: this.ids.now()
    };
    this.failures[index] = resolved;
    return resolved;
  }

  list(serviceId?: string, unresolvedOnly = false): ServiceFailureRecord[] {
    return this.failures
      .filter((failure) => !serviceId || failure.serviceId === serviceId)
      .filter((failure) => !unresolvedOnly || !failure.resolvedAt)
      .slice()
      .reverse();
  }

  unresolvedCount(): number {
    return this.failures.filter((failure) => !failure.resolvedAt).length;
  }
}