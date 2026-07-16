import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelIsolationRecord } from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelIsolationService {
  private readonly records = new Map<string, KernelIsolationRecord>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Kernel isolation record not found: ${id}`);
    }

    return record;
  }

  isolate(input: {
    componentId: string;
    reason: string;
    isolatedByIdentityId: string;
    correlationId: string;
  }) {
    this.health.getRecord(input.componentId);

    const active = this.list().find(
      (record) => record.componentId === input.componentId && record.active
    );

    if (active) {
      return active;
    }

    const record: KernelIsolationRecord = {
      id: `kernel-isolation:${Date.now()}:${this.records.size + 1}`,
      componentId: input.componentId,
      reason: input.reason,
      isolatedByIdentityId: input.isolatedByIdentityId,
      correlationId: input.correlationId,
      active: true,
      isolatedAt: new Date().toISOString()
    };

    this.records.set(record.id, record);
    this.health.setIsolation(input.componentId, true);

    this.audit.record({
      correlationId: input.correlationId,
      category: "isolation",
      action: "kernel-component-isolated",
      subjectId: record.id,
      actorIdentityId: input.isolatedByIdentityId,
      outcome: "warning",
      metadata: {
        componentId: input.componentId,
        reason: input.reason
      }
    });

    return record;
  }

  release(input: {
    isolationId: string;
    releasedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.isolationId);

    if (!current.active) {
      throw new ConflictException(
        `Kernel isolation is not active: ${current.id}`
      );
    }

    const updated: KernelIsolationRecord = {
      ...current,
      active: false,
      releasedAt: new Date().toISOString(),
      releasedByIdentityId: input.releasedByIdentityId
    };

    this.records.set(updated.id, updated);
    this.health.setIsolation(updated.componentId, false);

    this.audit.record({
      correlationId: input.correlationId,
      category: "isolation",
      action: "kernel-component-isolation-released",
      subjectId: updated.id,
      actorIdentityId: input.releasedByIdentityId,
      outcome: "success",
      metadata: {
        componentId: updated.componentId
      }
    });

    return updated;
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      active: records.filter((record) => record.active).length,
      released: records.filter((record) => !record.active).length
    };
  }
}
