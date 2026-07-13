import { Injectable } from "@nestjs/common";
import {
  VehicleEventAuditEntry,
  VehicleEventRecord,
  VehicleEventStatus,
} from "./vehicle-event-persistence.types";

@Injectable()
export class VehicleEventPersistenceStoreService {
  private readonly events = new Map<string, VehicleEventRecord>();
  private readonly auditEntries: VehicleEventAuditEntry[] = [];

  create(input: {
    vehicleId: string;
    eventType: string;
    payload?: Record<string, unknown>;
    maxAttempts?: number;
  }): VehicleEventRecord {
    const now = new Date().toISOString();
    const record: VehicleEventRecord = {
      id: `vehicle-event-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      vehicleId: input.vehicleId,
      eventType: input.eventType,
      status: "PENDING",
      attempts: 0,
      maxAttempts: Math.max(1, input.maxAttempts ?? 3),
      payload: input.payload ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.events.set(record.id, record);
    this.audit(record.id, "CREATED", {
      vehicleId: record.vehicleId,
      eventType: record.eventType,
    });

    return record;
  }

  get(id: string): VehicleEventRecord | undefined {
    return this.events.get(id);
  }

  list(status?: VehicleEventStatus): VehicleEventRecord[] {
    return [...this.events.values()]
      .filter((item) => !status || item.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  update(
    id: string,
    patch: Partial<VehicleEventRecord>,
    auditAction?: string,
  ): VehicleEventRecord {
    const current = this.events.get(id);

    if (!current) {
      throw new Error(`Vehicle event not found: ${id}`);
    }

    const next: VehicleEventRecord = {
      ...current,
      ...patch,
      id: current.id,
      updatedAt: new Date().toISOString(),
    };

    this.events.set(id, next);

    if (auditAction) {
      this.audit(id, auditAction, patch as Record<string, unknown>);
    }

    return next;
  }

  audit(
    eventId: string,
    action: string,
    details: Record<string, unknown>,
  ): VehicleEventAuditEntry {
    const entry: VehicleEventAuditEntry = {
      id: `vehicle-audit-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      eventId,
      action,
      details,
      createdAt: new Date().toISOString(),
    };

    this.auditEntries.push(entry);
    return entry;
  }

  auditTrail(eventId?: string): VehicleEventAuditEntry[] {
    return this.auditEntries
      .filter((item) => !eventId || item.eventId === eventId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
