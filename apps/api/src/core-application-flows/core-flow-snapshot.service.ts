import { Injectable, NotFoundException } from "@nestjs/common";
import type { CoreFlowSnapshot } from "./core-flow-operations.types";

@Injectable()
export class CoreFlowSnapshotService {
  private readonly snapshots = new Map<string, CoreFlowSnapshot[]>();

  create(operationId: string, state: Record<string, unknown>) {
    const list = this.snapshots.get(operationId) ?? [];
    const snapshot: CoreFlowSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      operationId,
      version: list.length + 1,
      state,
      createdAt: new Date().toISOString(),
    };
    list.push(snapshot);
    this.snapshots.set(operationId, list);
    return snapshot;
  }

  latest(operationId: string) {
    const list = this.snapshots.get(operationId) ?? [];
    const snapshot = list[list.length - 1];
    if (!snapshot) throw new NotFoundException("Flow snapshot not found");
    return snapshot;
  }

  history(operationId: string) {
    return (this.snapshots.get(operationId) ?? []).slice().reverse();
  }
}
