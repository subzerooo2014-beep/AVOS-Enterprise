import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { PlatformServicesDiscoveryService } from "./platform-services-discovery.service";
import type { PlatformServiceRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class PlatformServicesCatalogService implements OnModuleInit {
  private readonly components = new Map<string, PlatformServiceRecord>();
  private lastDiscoveryAt?: string;

  constructor(private readonly discovery: PlatformServicesDiscoveryService) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): PlatformServiceRecord[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): PlatformServiceRecord[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  byType(type: string): PlatformServiceRecord[] {
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
