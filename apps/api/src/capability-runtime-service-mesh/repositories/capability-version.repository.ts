import { Injectable } from '@nestjs/common';
import { CapabilityVersionRecord } from '../domain/capability-runtime.types';

@Injectable()
export class CapabilityVersionRepository {
  private readonly records = new Map<string, CapabilityVersionRecord[]>();

  add(record: CapabilityVersionRecord): CapabilityVersionRecord {
    const current = this.records.get(record.capabilityId) ?? [];
    const next = current.map((item) => ({ ...item, active: false }));
    next.push(structuredClone(record));
    this.records.set(record.capabilityId, next);
    return structuredClone(record);
  }

  list(capabilityId: string): CapabilityVersionRecord[] {
    return (this.records.get(capabilityId) ?? []).map((item) =>
      structuredClone(item),
    );
  }

  active(capabilityId: string): CapabilityVersionRecord | null {
    return (
      this.list(capabilityId).find((item) => item.active) ?? null
    );
  }
}