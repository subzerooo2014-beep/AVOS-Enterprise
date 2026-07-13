import { Injectable } from "@nestjs/common";
import type { RuntimeFinalizationRecord } from "./core-flow-runtime.types";
import { CoreFlowRuntimeRegistryService } from "./core-flow-runtime-registry.service";
import { CoreFlowObservabilityService } from "./core-flow-observability.service";
import { CoreFlowConformanceService } from "./core-flow-conformance.service";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowRuntimeFinalizationService {
  private readonly records: RuntimeFinalizationRecord[] = [];

  constructor(
    private readonly registry: CoreFlowRuntimeRegistryService,
    private readonly observability: CoreFlowObservabilityService,
    private readonly conformance: CoreFlowConformanceService,
    private readonly audit: CoreFlowAuditService,
  ) {}

  finalize(dto: any = {}) {
    const registry = this.registry.stats();
    const health = this.observability.health();
    const conformance = this.conformance.dashboard();

    const qualityScore = Math.max(
      0,
      Math.min(
        100,
        100 - registry.degraded * 10 - registry.paused * 5 -
          conformance.failed * 5 - (!health.healthy ? 30 : 0),
      ),
    );

    const healthStatus: RuntimeFinalizationRecord["healthStatus"] =
      health.healthy ? (registry.degraded || registry.paused ? "degraded" : "healthy") : "unhealthy";

    const certification: RuntimeFinalizationRecord["certification"] =
      qualityScore >= 95 && healthStatus === "healthy"
        ? "certified"
        : qualityScore >= 80 ? "pending" : "rejected";

    const record: RuntimeFinalizationRecord = {
      id: `finalization_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      scope: String(dto?.scope ?? "core-application-flows-v1"),
      version: String(dto?.version ?? "1.300.0"),
      qualityScore,
      healthStatus,
      certification,
      finalizedAt: new Date().toISOString(),
    };

    this.records.push(record);
    this.audit.write(record.id, "runtime.finalized", record as unknown as Record<string, unknown>);
    return { record, registry, health, conformance };
  }

  findAll() {
    return this.records.slice().reverse();
  }
}
