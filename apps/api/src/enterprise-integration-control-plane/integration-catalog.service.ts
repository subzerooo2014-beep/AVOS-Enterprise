import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { IntegrationDiscoveryService } from "./integration-discovery.service";
import type { IntegrationComponentRecord } from "./enterprise-integration-control-plane.types";

@Injectable()
export class IntegrationCatalogService implements OnModuleInit {
  private readonly components = new Map<string, IntegrationComponentRecord>();
  private lastDiscoveryAt?: string;

  constructor(private readonly discovery: IntegrationDiscoveryService) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): IntegrationComponentRecord[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): IntegrationComponentRecord[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  byType(type: string): IntegrationComponentRecord[] {
    return this.list().filter((item) => item.type === type);
  }

  byDomain(domain: string): IntegrationComponentRecord[] {
    return this.list().filter((item) => item.domain === domain);
  }

  count(): number {
    return this.components.size;
  }

  status(): { lastDiscoveryAt?: string; components: number } {
    return {
      lastDiscoveryAt: this.lastDiscoveryAt,
      components: this.components.size,
    };
  }
}
