import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelComponentHealthRecord,
  KernelHealthSignal
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelHealthRegistryService {
  private readonly signals = new Map<string, KernelHealthSignal>();
  private readonly records = new Map<string, KernelComponentHealthRecord>();

  constructor(
    private readonly audit: KernelResilienceAuditService
  ) {
    this.seed();
  }

  listSignals() {
    return Array.from(this.signals.values());
  }

  listRecords() {
    return Array.from(this.records.values());
  }

  getRecord(componentId: string) {
    const record = this.records.get(componentId);

    if (!record) {
      throw new NotFoundException(
        `Kernel health component not found: ${componentId}`
      );
    }

    return record;
  }

  registerComponent(input: {
    componentId: string;
    componentName: string;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const existing = this.records.get(input.componentId);

    if (existing) {
      return existing;
    }

    const record: KernelComponentHealthRecord = {
      id: `kernel-health-record:${input.componentId}`,
      componentId: input.componentId,
      componentName: input.componentName,
      status: "unknown",
      score: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      isolated: false,
      recoveryInProgress: false,
      metadata: input.metadata ?? {},
      updatedAt: new Date().toISOString()
    };

    this.records.set(record.componentId, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-health-component-registered",
      subjectId: record.componentId,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        componentName: record.componentName
      }
    });

    return record;
  }

  ingestSignal(input: {
    componentId: string;
    status: KernelHealthSignal["status"];
    score: number;
    source: string;
    message: string;
    metrics?: Record<string, number>;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.getRecord(input.componentId);

    const signal: KernelHealthSignal = {
      id: `kernel-health-signal:${Date.now()}:${this.signals.size + 1}`,
      componentId: input.componentId,
      status: input.status,
      score: Math.max(0, Math.min(100, input.score)),
      source: input.source,
      message: input.message,
      metrics: input.metrics ?? {},
      metadata: input.metadata ?? {},
      observedAt: new Date().toISOString()
    };

    this.signals.set(signal.id, signal);

    const isFailure =
      ["unhealthy", "critical"].includes(signal.status);

    const isSuccess =
      signal.status === "healthy";

    const updated: KernelComponentHealthRecord = {
      ...current,
      status: current.isolated
        ? "isolated"
        : signal.status,
      score: signal.score,
      lastSignalId: signal.id,
      consecutiveFailures: isFailure
        ? current.consecutiveFailures + 1
        : 0,
      consecutiveSuccesses: isSuccess
        ? current.consecutiveSuccesses + 1
        : 0,
      metadata: {
        ...current.metadata,
        lastMessage: signal.message,
        lastMetrics: signal.metrics
      },
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.componentId, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-health-signal-ingested",
      subjectId: signal.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        isFailure
          ? "failure"
          : signal.status === "degraded"
            ? "warning"
            : "success",
      metadata: {
        componentId: input.componentId,
        status: signal.status,
        score: signal.score
      }
    });

    return {
      signal,
      record: updated
    };
  }

  setIsolation(componentId: string, isolated: boolean) {
    const current = this.getRecord(componentId);

    const updated: KernelComponentHealthRecord = {
      ...current,
      isolated,
      status: isolated ? "isolated" : current.status === "isolated" ? "unknown" : current.status,
      updatedAt: new Date().toISOString()
    };

    this.records.set(componentId, updated);
    return updated;
  }

  setRecovery(componentId: string, recoveryInProgress: boolean) {
    const current = this.getRecord(componentId);

    const updated: KernelComponentHealthRecord = {
      ...current,
      recoveryInProgress,
      status: recoveryInProgress ? "recovering" : current.status,
      updatedAt: new Date().toISOString()
    };

    this.records.set(componentId, updated);
    return updated;
  }

  summary() {
    const records = this.listRecords();

    return {
      total: records.length,
      healthy: records.filter((x) => x.status === "healthy").length,
      degraded: records.filter((x) => x.status === "degraded").length,
      unhealthy: records.filter((x) => x.status === "unhealthy").length,
      critical: records.filter((x) => x.status === "critical").length,
      isolated: records.filter((x) => x.isolated).length,
      recovering: records.filter((x) => x.recoveryInProgress).length,
      signals: this.signals.size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const components: KernelComponentHealthRecord[] = [
      {
        id: "kernel-health-record:runtime",
        componentId: "kernel:runtime",
        componentName: "Kernel Runtime",
        status: "healthy",
        score: 100,
        consecutiveFailures: 0,
        consecutiveSuccesses: 1,
        isolated: false,
        recoveryInProgress: false,
        metadata: { seeded: true },
        updatedAt: now
      },
      {
        id: "kernel-health-record:lifecycle",
        componentId: "kernel:lifecycle",
        componentName: "Kernel Lifecycle",
        status: "healthy",
        score: 100,
        consecutiveFailures: 0,
        consecutiveSuccesses: 1,
        isolated: false,
        recoveryInProgress: false,
        metadata: { seeded: true },
        updatedAt: now
      },
      {
        id: "kernel-health-record:dependency-config",
        componentId: "kernel:dependency-config",
        componentName: "Kernel Dependency and Configuration",
        status: "healthy",
        score: 100,
        consecutiveFailures: 0,
        consecutiveSuccesses: 1,
        isolated: false,
        recoveryInProgress: false,
        metadata: { seeded: true },
        updatedAt: now
      },
      {
        id: "kernel-health-record:security",
        componentId: "kernel:security",
        componentName: "Kernel Security and Policy",
        status: "healthy",
        score: 100,
        consecutiveFailures: 0,
        consecutiveSuccesses: 1,
        isolated: false,
        recoveryInProgress: false,
        metadata: { seeded: true },
        updatedAt: now
      }
    ];

    for (const component of components) {
      this.records.set(component.componentId, component);
    }
  }
}
