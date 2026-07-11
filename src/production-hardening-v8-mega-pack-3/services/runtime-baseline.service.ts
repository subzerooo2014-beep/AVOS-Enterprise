import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  RuntimeBaseline,
} from "../contracts/runtime-resilience.contracts";
import { EvidenceEntryType } from "../contracts/runtime-resilience.enums";
import { CaptureRuntimeBaselineDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { sha256Json } from "../utils/runtime-hash.util";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class RuntimeBaselineService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  capture(
    dto: CaptureRuntimeBaselineDto,
  ): RuntimeBaseline {
    const configurationIds =
      dto.configurationIds ??
      this.store
        .listConfigurations()
        .filter(
          (configuration) =>
            configuration.environment === dto.environment &&
            configuration.namespace === dto.namespace &&
            configuration.status === "active",
        )
        .map((configuration) => configuration.id);

    for (const configurationId of configurationIds) {
      if (!this.store.getConfiguration(configurationId)) {
        throw new NotFoundException(
          `Baseline configuration ${configurationId} was not found`,
        );
      }
    }

    const signalSnapshot =
      (dto.signalSnapshot as Record<string, JsonValue>) ??
      this.buildSignalSnapshot(
        dto.environment,
        dto.namespace,
      );

    const metadata = (dto.metadata ?? {}) as Record<
      string,
      JsonValue
    >;

    const capturedAt = new Date().toISOString();

    const snapshotHash = sha256Json({
      key: dto.key,
      environment: dto.environment,
      namespace: dto.namespace,
      configurationIds,
      signalSnapshot,
      metadata,
      capturedAt,
    });

    const baseline: RuntimeBaseline = {
      id: randomUUID(),
      key: dto.key,
      name: dto.name,
      environment: dto.environment,
      namespace: dto.namespace,
      configurationIds,
      signalSnapshot,
      metadata,
      snapshotHash,
      capturedBy: dto.actor,
      capturedAt,
      active: true,
    };

    const saved = this.store.saveBaseline(baseline);

    this.evidence.append({
      type: EvidenceEntryType.BASELINE_CAPTURED,
      aggregateType: "runtime_baseline",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        baselineId: saved.id,
        key: saved.key,
        environment: saved.environment,
        namespace: saved.namespace,
        configurationIds: saved.configurationIds,
        snapshotHash: saved.snapshotHash,
        active: saved.active,
      },
    });

    return saved;
  }

  list(): RuntimeBaseline[] {
    return this.store.listBaselines();
  }

  get(id: string): RuntimeBaseline {
    const baseline = this.store.getBaseline(id);

    if (!baseline) {
      throw new NotFoundException(
        `Runtime baseline ${id} was not found`,
      );
    }

    return baseline;
  }

  verify(id: string): {
    valid: boolean;
    baselineId: string;
    storedHash: string;
    calculatedHash: string;
    verifiedAt: string;
  } {
    const baseline = this.get(id);

    const calculatedHash = sha256Json({
      key: baseline.key,
      environment: baseline.environment,
      namespace: baseline.namespace,
      configurationIds: baseline.configurationIds,
      signalSnapshot: baseline.signalSnapshot,
      metadata: baseline.metadata,
      capturedAt: baseline.capturedAt,
    });

    return {
      valid: calculatedHash === baseline.snapshotHash,
      baselineId: baseline.id,
      storedHash: baseline.snapshotHash,
      calculatedHash,
      verifiedAt: new Date().toISOString(),
    };
  }

  private buildSignalSnapshot(
    environment: string,
    namespace: string,
  ): Record<string, JsonValue> {
    const signals = this.store
      .listSignals()
      .filter(
        (signal) =>
          signal.environment === environment &&
          signal.namespace === namespace,
      );

    const byStatus = signals.reduce<Record<string, number>>(
      (summary, signal) => {
        summary[signal.status] =
          (summary[signal.status] ?? 0) + 1;

        return summary;
      },
      {},
    );

    const byType = signals.reduce<Record<string, number>>(
      (summary, signal) => {
        summary[signal.type] =
          (summary[signal.type] ?? 0) + 1;

        return summary;
      },
      {},
    );

    return {
      total: signals.length,
      byStatus,
      byType,
      latestObservedAt:
        signals
          .slice()
          .sort((a, b) =>
            b.observedAt.localeCompare(a.observedAt),
          )[0]?.observedAt ?? null,
    };
  }
}
