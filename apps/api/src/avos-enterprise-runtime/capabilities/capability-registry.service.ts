import { Injectable } from '@nestjs/common';
import {
  CapabilityDescriptor,
  CapabilityLifecycleState,
} from '../contracts/runtime.contracts';
import { CapabilityNotFoundError } from '../shared/runtime.errors';
import { clone, nowIso, stableSort } from '../shared/runtime.utils';

@Injectable()
export class CapabilityRegistryService {
  private readonly capabilities = new Map<string, CapabilityDescriptor>();

  register(
    descriptor: Omit<CapabilityDescriptor, 'discoveredAt' | 'updatedAt'>,
  ): CapabilityDescriptor {
    const existing = this.capabilities.get(descriptor.id);
    const timestamp = nowIso();

    const stored: CapabilityDescriptor = {
      ...descriptor,
      discoveredAt: existing?.discoveredAt ?? timestamp,
      updatedAt: timestamp,
      metadata: clone(descriptor.metadata),
      dependencies: [...descriptor.dependencies],
      policies: [...descriptor.policies],
      tags: [...descriptor.tags],
    };

    this.capabilities.set(stored.id, stored);
    return clone(stored);
  }

  registerMany(
    descriptors: Array<
      Omit<CapabilityDescriptor, 'discoveredAt' | 'updatedAt'>
    >,
  ): CapabilityDescriptor[] {
    return descriptors.map((descriptor) => this.register(descriptor));
  }

  get(id: string): CapabilityDescriptor {
    const capability = this.capabilities.get(id);
    if (!capability) {
      throw new CapabilityNotFoundError(id);
    }
    return clone(capability);
  }

  tryGet(id: string): CapabilityDescriptor | undefined {
    const capability = this.capabilities.get(id);
    return capability ? clone(capability) : undefined;
  }

  list(): CapabilityDescriptor[] {
    return stableSort(
      [...this.capabilities.values()].map((item) => clone(item)),
      (item) => `${item.group}:${item.id}`,
    );
  }

  updateState(
    id: string,
    state: CapabilityLifecycleState,
  ): CapabilityDescriptor {
    const capability = this.get(id);
    return this.register({
      ...capability,
      state,
    });
  }

  updateHealth(
    id: string,
    health: CapabilityDescriptor['health'],
  ): CapabilityDescriptor {
    const capability = this.get(id);
    return this.register({
      ...capability,
      health,
    });
  }

  count(): number {
    return this.capabilities.size;
  }

  clear(): void {
    this.capabilities.clear();
  }
}