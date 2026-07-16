import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { BusinessOperationsDiscoveryService } from "./business-operations-discovery.service";
import type { BusinessComponentRecord } from "./enterprise-business-operations.types";

@Injectable()
export class BusinessCatalogService implements OnModuleInit {
  private readonly components = new Map<string, BusinessComponentRecord>();
  private lastDiscoveryAt?: string;

  constructor(
    private readonly discovery: BusinessOperationsDiscoveryService,
  ) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): BusinessComponentRecord[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): BusinessComponentRecord[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  byType(type: string): BusinessComponentRecord[] {
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
