import { Injectable } from '@nestjs/common';
import { CapabilityDescriptor } from '../domain/capability-runtime.types';

@Injectable()
export class CapabilityRegistryRepository {
  private readonly records = new Map<string, CapabilityDescriptor>();

  save(descriptor: CapabilityDescriptor): CapabilityDescriptor {
    this.records.set(descriptor.id, structuredClone(descriptor));
    return this.get(descriptor.id)!;
  }

  get(id: string): CapabilityDescriptor | null {
    const record = this.records.get(id);
    return record ? structuredClone(record) : null;
  }

  list(): CapabilityDescriptor[] {
    return [...this.records.values()].map((item) => structuredClone(item));
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }
}