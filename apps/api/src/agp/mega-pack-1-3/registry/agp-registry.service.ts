import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpRegistryItem } from "../contracts/agp-runtime.contracts";

@Injectable()
export class AgpRegistryService {
  private readonly items = new Map<string, AgpRegistryItem>();

  register(
    input: Omit<AgpRegistryItem, "id" | "registeredAt" | "status"> &
      Partial<Pick<AgpRegistryItem, "status">>,
  ): AgpRegistryItem {
    const existing = [...this.items.values()].find(
      (item) => item.type === input.type && item.name === input.name,
    );

    if (existing) {
      const updated: AgpRegistryItem = {
        ...existing,
        version: input.version,
        dependencies: [...input.dependencies],
        status: input.status ?? "active",
      };
      this.items.set(updated.id, updated);
      return { ...updated };
    }

    const item: AgpRegistryItem = {
      id: `agp-registry:${randomUUID()}`,
      type: input.type,
      name: input.name,
      version: input.version,
      status: input.status ?? "active",
      dependencies: [...input.dependencies],
      registeredAt: new Date().toISOString(),
    };

    this.items.set(item.id, item);
    return { ...item };
  }

  getByType(type: AgpRegistryItem["type"]): AgpRegistryItem[] {
    return [...this.items.values()]
      .filter((item) => item.type === type)
      .map((item) => ({ ...item }));
  }

  getAll(): AgpRegistryItem[] {
    return [...this.items.values()].map((item) => ({ ...item }));
  }

  snapshot() {
    const all = this.getAll();
    return {
      total: all.length,
      active: all.filter((item) => item.status === "active").length,
      byType: {
        capabilities: this.getByType("capability").length,
        services: this.getByType("service").length,
        engines: this.getByType("engine").length,
        strategies: this.getByType("strategy").length,
        integrations: this.getByType("integration").length,
      },
      items: all,
      generatedAt: new Date().toISOString(),
    };
  }
}