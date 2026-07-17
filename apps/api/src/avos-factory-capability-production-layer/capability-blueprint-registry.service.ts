import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CapabilityBlueprint } from "./capability-production.contracts";

@Injectable()
export class CapabilityBlueprintRegistryService {
  private readonly items = new Map<string, CapabilityBlueprint>();

  register(input: Omit<CapabilityBlueprint, "id" | "createdAt">): CapabilityBlueprint {
    const item: CapabilityBlueprint = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  get(id: string): CapabilityBlueprint | null {
    return this.items.get(id) ?? null;
  }

  list(limit = 100): CapabilityBlueprint[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
