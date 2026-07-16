import { Injectable } from "@nestjs/common";
import { AdvancedTwinRegistryService } from "./advanced-twin-registry.service";
import type {
  TwinStateSnapshotRecord,
  TwinSynchronizationRecord,
} from "./enterprise-advanced-digital-twin.types";

@Injectable()
export class TwinStateSynchronizationService {
  private readonly snapshots: TwinStateSnapshotRecord[] = [];
  private readonly synchronizations: TwinSynchronizationRecord[] = [];

  constructor(private readonly twins: AdvancedTwinRegistryService) {}

  synchronize(
    twinId: string,
    source: string,
    state: Record<string, unknown>,
    error?: string,
  ): TwinSynchronizationRecord {
    const startedAt = new Date().toISOString();

    const synchronization: TwinSynchronizationRecord = {
      id: `twin-sync-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      twinId,
      source,
      status: error ? "FAILED" : "COMPLETED",
      fieldsUpdated: error ? [] : Object.keys(state),
      startedAt,
      completedAt: new Date().toISOString(),
      error,
    };

    if (!error) {
      const twin = this.twins.updateState(twinId, state);

      const snapshot: TwinStateSnapshotRecord = {
        id: `twin-snapshot-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 10)}`,
        twinId,
        state: { ...twin.state },
        source,
        version: twin.version,
        createdAt: new Date().toISOString(),
      };

      this.snapshots.unshift(snapshot);
    }

    this.synchronizations.unshift(synchronization);
    return this.cloneSynchronization(synchronization);
  }

  snapshotsList(): TwinStateSnapshotRecord[] {
    return this.snapshots.map((snapshot) => ({
      ...snapshot,
      state: { ...snapshot.state },
    }));
  }

  synchronizationsList(): TwinSynchronizationRecord[] {
    return this.synchronizations.map((item) =>
      this.cloneSynchronization(item),
    );
  }

  snapshotCount(): number {
    return this.snapshots.length;
  }

  synchronizationCount(): number {
    return this.synchronizations.length;
  }

  failedSynchronizationCount(): number {
    return this.synchronizations.filter((item) => item.status === "FAILED")
      .length;
  }

  private cloneSynchronization(
    item: TwinSynchronizationRecord,
  ): TwinSynchronizationRecord {
    return {
      ...item,
      fieldsUpdated: [...item.fieldsUpdated],
    };
  }
}
