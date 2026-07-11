import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  RuntimeSignal,
} from "../contracts/runtime-resilience.contracts";
import {
  EvidenceEntryType,
  RuntimeSignalStatus,
} from "../contracts/runtime-resilience.enums";
import { RecordRuntimeSignalDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class RuntimeSignalService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  record(dto: RecordRuntimeSignalDto): RuntimeSignal {
    const receivedAt = new Date().toISOString();

    const signal: RuntimeSignal = {
      id: randomUUID(),
      source: dto.source,
      environment: dto.environment,
      namespace: dto.namespace,
      service: dto.service,
      type: dto.type,
      status: dto.status,
      value: dto.value,
      unit: dto.unit,
      thresholdWarning: dto.thresholdWarning,
      thresholdCritical: dto.thresholdCritical,
      message: dto.message,
      labels: dto.labels ?? {},
      metadata: (dto.metadata ?? {}) as Record<string, JsonValue>,
      observedAt: dto.observedAt ?? receivedAt,
      receivedAt,
    };

    const saved = this.store.saveSignal(signal);

    this.evidence.append({
      type: EvidenceEntryType.SIGNAL_RECORDED,
      aggregateType: "runtime_signal",
      aggregateId: saved.id,
      actor: {
        id: dto.source,
        type: "service",
        name: dto.source,
      },
      payload: {
        signalId: saved.id,
        environment: saved.environment,
        namespace: saved.namespace,
        service: saved.service,
        type: saved.type,
        status: saved.status,
        value: saved.value,
        unit: saved.unit ?? null,
        observedAt: saved.observedAt,
      },
    });

    return saved;
  }

  list(filters?: {
    environment?: string;
    namespace?: string;
    service?: string;
    status?: RuntimeSignalStatus;
  }): RuntimeSignal[] {
    return this.store.listSignals().filter((signal) => {
      if (
        filters?.environment &&
        signal.environment !== filters.environment
      ) {
        return false;
      }

      if (
        filters?.namespace &&
        signal.namespace !== filters.namespace
      ) {
        return false;
      }

      if (
        filters?.service &&
        signal.service !== filters.service
      ) {
        return false;
      }

      if (
        filters?.status &&
        signal.status !== filters.status
      ) {
        return false;
      }

      return true;
    });
  }

  get(id: string): RuntimeSignal {
    const signal = this.store.getSignal(id);

    if (!signal) {
      throw new NotFoundException(
        `Runtime signal ${id} was not found`,
      );
    }

    return signal;
  }

  summarize(filters?: {
    environment?: string;
    namespace?: string;
    service?: string;
  }): {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
    unknown: number;
    latestObservedAt?: string;
  } {
    const signals = this.list(filters);

    return {
      total: signals.length,
      healthy: signals.filter(
        (signal) =>
          signal.status === RuntimeSignalStatus.HEALTHY,
      ).length,
      degraded: signals.filter(
        (signal) =>
          signal.status === RuntimeSignalStatus.DEGRADED,
      ).length,
      unhealthy: signals.filter(
        (signal) =>
          signal.status === RuntimeSignalStatus.UNHEALTHY,
      ).length,
      unknown: signals.filter(
        (signal) =>
          signal.status === RuntimeSignalStatus.UNKNOWN,
      ).length,
      latestObservedAt: signals
        .slice()
        .sort((a, b) =>
          b.observedAt.localeCompare(a.observedAt),
        )[0]?.observedAt,
    };
  }
}
