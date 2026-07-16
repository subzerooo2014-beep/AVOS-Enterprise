import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { IntelligenceDiscoveryService } from "./intelligence-discovery.service";
import type { IntelligenceComponentRecord } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class IntelligenceCatalogService implements OnModuleInit {
  private readonly components = new Map<string, IntelligenceComponentRecord>();
  private lastDiscoveryAt?: string;

  constructor(private readonly discovery: IntelligenceDiscoveryService) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): IntelligenceComponentRecord[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): IntelligenceComponentRecord[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  byType(type: string): IntelligenceComponentRecord[] {
    return this.list().filter((item) => item.type === type);
  }

  count(): number {
    return this.components.size;
  }

  status() {
    return {
      components: this.components.size,
      lastDiscoveryAt: this.lastDiscoveryAt,
    };
  }
}
