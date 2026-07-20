import { Injectable } from '@nestjs/common';
import { CapabilityHealth } from '../domain/capability-runtime.types';

@Injectable()
export class CapabilityHealthRepository {
  private readonly records = new Map<string, CapabilityHealth>();

  save(health: CapabilityHealth): CapabilityHealth {
    this.records.set(health.capabilityId, structuredClone(health));
    return this.get(health.capabilityId)!;
  }

  get(capabilityId: string): CapabilityHealth | null {
    const health = this.records.get(capabilityId);
    return health ? structuredClone(health) : null;
  }

  list(): CapabilityHealth[] {
    return [...this.records.values()].map((item) => structuredClone(item));
  }
}