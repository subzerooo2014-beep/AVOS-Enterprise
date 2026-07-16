import { Injectable } from "@nestjs/common";
import type {
  IntegrationComponentRecord,
  IntegrationProviderRecord,
} from "./enterprise-integration-control-plane.types";

@Injectable()
export class IntegrationProviderRegistryService {
  private readonly providers = new Map<string, IntegrationProviderRecord>();

  sync(components: IntegrationComponentRecord[]): IntegrationProviderRecord[] {
    this.providers.clear();

    for (const component of components.filter(
      (item) => item.type === "PROVIDER" || item.type === "CONNECTOR",
    )) {
      this.providers.set(component.id, {
        id: component.id,
        name: component.name,
        domain: component.domain,
        version: component.version,
        capabilities: [...component.capabilities],
        health: component.capabilities.includes("HEALTH")
          ? "HEALTHY"
          : "UNKNOWN",
      });
    }

    return this.list();
  }

  list(): IntegrationProviderRecord[] {
    return Array.from(this.providers.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
    }));
  }

  updateHealth(
    id: string,
    health: IntegrationProviderRecord["health"],
  ): IntegrationProviderRecord | undefined {
    const provider = this.providers.get(id);
    if (!provider) return undefined;

    const updated = { ...provider, health };
    this.providers.set(id, updated);
    return { ...updated, capabilities: [...updated.capabilities] };
  }

  count(): number {
    return this.providers.size;
  }
}
