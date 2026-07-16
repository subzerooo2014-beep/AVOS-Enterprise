import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { EventPlatformDiscoveryService } from "./event-platform-discovery.service";
import type {
  EventPlatformComponent,
  EventPlatformMetrics,
} from "./event-platform-integration.types";

@Injectable()
export class EventPlatformCatalogService implements OnModuleInit {
  private readonly components = new Map<string, EventPlatformComponent>();
  private lastDiscoveryAt?: string;

  constructor(
    private readonly discovery: EventPlatformDiscoveryService,
  ) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): EventPlatformComponent[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): EventPlatformComponent[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  findById(id: string): EventPlatformComponent | undefined {
    const item = this.components.get(id);

    return item
      ? {
          ...item,
          capabilities: [...item.capabilities],
          dependencies: [...item.dependencies],
        }
      : undefined;
  }

  findByType(type: string): EventPlatformComponent[] {
    return this.list().filter((item) => item.type === type);
  }

  domains(): { domain: string; components: number }[] {
    const grouped = new Map<string, number>();

    for (const component of this.list()) {
      grouped.set(
        component.domain,
        (grouped.get(component.domain) ?? 0) + 1,
      );
    }

    return Array.from(grouped.entries())
      .map(([domain, components]) => ({ domain, components }))
      .sort((a, b) => a.domain.localeCompare(b.domain));
  }

  metrics(routes: number): EventPlatformMetrics {
    const items = this.list();

    return {
      totalComponents: items.length,
      eventBuses: items.filter((item) => item.type === "EVENT_BUS").length,
      registries: items.filter((item) => item.type === "EVENT_REGISTRY").length,
      dispatchers: items.filter((item) => item.type === "EVENT_DISPATCHER").length,
      retryPolicies: items.filter((item) => item.type === "RETRY_POLICY").length,
      deadLetterServices: items.filter((item) => item.type === "DEAD_LETTER").length,
      domainEventFolders: new Set(
        items
          .filter((item) => item.type === "DOMAIN_EVENTS")
          .map((item) => item.domain),
      ).size,
      routes,
    };
  }

  discoveryStatus() {
    return {
      lastDiscoveryAt: this.lastDiscoveryAt,
      totalComponents: this.components.size,
    };
  }
}
