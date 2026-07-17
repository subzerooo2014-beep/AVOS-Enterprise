import { Injectable } from "@nestjs/common";
import {
  AvosFactoryIntegrationDescriptor,
  AvosFactoryIntegrationRegistry,
  AvosFactoryIntegrationTarget
} from "./avos-factory-integration.contracts";
import {
  AvosFactoryIntegrationDiscoveryService
} from "./avos-factory-integration-discovery.service";

@Injectable()
export class AvosFactoryIntegrationRegistryService {
  private registry?: AvosFactoryIntegrationRegistry;

  constructor(
    private readonly discovery:
      AvosFactoryIntegrationDiscoveryService
  ) {}

  refresh(): AvosFactoryIntegrationRegistry {
    this.registry =
      this.discovery.discover();

    return structuredClone(this.registry);
  }

  getRegistry(): AvosFactoryIntegrationRegistry {
    return this.registry
      ? structuredClone(this.registry)
      : this.refresh();
  }

  markConnected(
    target: AvosFactoryIntegrationTarget
  ): AvosFactoryIntegrationDescriptor {
    const registry =
      this.getRegistry();

    const integration =
      registry.integrations.find(
        (item) => item.target === target
      );

    if (!integration) {
      throw new Error(
        `Integration target not found: ${target}`
      );
    }

    integration.status = "connected";
    integration.lastCheckedAt =
      new Date().toISOString();

    registry.connectedCount =
      registry.integrations.filter(
        (item) =>
          item.status === "connected"
      ).length;

    registry.availableCount =
      registry.integrations.filter(
        (item) =>
          item.status === "available"
      ).length;

    registry.missingCount =
      registry.integrations.filter(
        (item) =>
          item.status === "not-detected"
      ).length;

    registry.generatedAt =
      new Date().toISOString();

    this.registry = registry;

    return structuredClone(integration);
  }
}
