import { Injectable, OnModuleInit } from "@nestjs/common";
import { join } from "path";
import { SecurityDiscoveryService } from "./security-discovery.service";
import type { SecurityComponentRecord } from "./enterprise-security-governance-control-plane.types";

@Injectable()
export class SecurityCatalogService implements OnModuleInit {
  private readonly components = new Map<string, SecurityComponentRecord>();
  private lastDiscoveryAt?: string;

  constructor(private readonly discovery: SecurityDiscoveryService) {}

  onModuleInit(): void {
    this.refresh();
  }

  refresh(): SecurityComponentRecord[] {
    const discovered = this.discovery.discover(join(process.cwd(), "src"));
    this.components.clear();

    for (const component of discovered) {
      this.components.set(component.id, component);
    }

    this.lastDiscoveryAt = new Date().toISOString();
    return this.list();
  }

  list(): SecurityComponentRecord[] {
    return Array.from(this.components.values()).map((item) => ({
      ...item,
      capabilities: [...item.capabilities],
      dependencies: [...item.dependencies],
    }));
  }

  byType(type: string): SecurityComponentRecord[] {
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
