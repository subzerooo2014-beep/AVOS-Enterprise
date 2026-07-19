import { Injectable } from "@nestjs/common";
import { FactoryCapabilityDescriptor } from "../contracts/factory.contracts";

@Injectable()
export class FactoryCapabilitiesService {
  private readonly capabilities = new Map<string, FactoryCapabilityDescriptor>();

  register(descriptor: FactoryCapabilityDescriptor): FactoryCapabilityDescriptor {
    const normalized: FactoryCapabilityDescriptor = {
      ...descriptor,
      dependencies: [...new Set(descriptor.dependencies ?? [])],
      metadata: descriptor.metadata ?? {},
    };
    this.capabilities.set(normalized.id, normalized);
    return normalized;
  }

  unregister(id: string): boolean {
    return this.capabilities.delete(id);
  }

  get(id: string): FactoryCapabilityDescriptor | undefined {
    return this.capabilities.get(id);
  }

  list(): FactoryCapabilityDescriptor[] {
    return [...this.capabilities.values()].sort((a, b) => a.id.localeCompare(b.id));
  }

  summary() {
    const items = this.list();
    return {
      total: items.length,
      enabled: items.filter((item) => item.enabled).length,
      disabled: items.filter((item) => !item.enabled).length,
      categories: items.reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}
