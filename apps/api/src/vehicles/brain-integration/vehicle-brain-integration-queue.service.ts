import { Injectable } from "@nestjs/common";
import {
  VehicleBrainIntegrationCommand,
  VehicleBrainIntegrationRecord,
} from "./vehicle-brain-integration.types";

@Injectable()
export class VehicleBrainIntegrationQueueService {
  private readonly records = new Map<string, VehicleBrainIntegrationRecord>();

  enqueue(
    command: VehicleBrainIntegrationCommand,
  ): VehicleBrainIntegrationRecord {
    const now = new Date().toISOString();
    const id = `vehicle-brain-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const record: VehicleBrainIntegrationRecord = {
      id,
      vehicleId: command.vehicleId,
      command: command.command,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      payload: command.payload ?? {},
    };

    this.records.set(id, record);
    return record;
  }

  list(): VehicleBrainIntegrationRecord[] {
    return [...this.records.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  get(id: string): VehicleBrainIntegrationRecord | undefined {
    return this.records.get(id);
  }

  update(
    id: string,
    patch: Partial<VehicleBrainIntegrationRecord>,
  ): VehicleBrainIntegrationRecord {
    const current = this.records.get(id);

    if (!current) {
      throw new Error(`Vehicle brain integration record not found: ${id}`);
    }

    const next: VehicleBrainIntegrationRecord = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(id, next);
    return next;
  }
}
