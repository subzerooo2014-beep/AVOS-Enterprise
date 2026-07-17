import { Injectable } from "@nestjs/common";
import { KnowledgeRegistryEntry } from "../contracts/knowledge-fabric-production.contracts";

@Injectable()
export class UnifiedKnowledgeRegistryService {
  private readonly entries = new Map<string, KnowledgeRegistryEntry>();

  register(
    entry: Omit<KnowledgeRegistryEntry, "registeredAt" | "updatedAt">,
  ): KnowledgeRegistryEntry {
    const now = new Date().toISOString();
    const existing = this.entries.get(entry.id);
    const registered: KnowledgeRegistryEntry = {
      ...entry,
      registeredAt: existing?.registeredAt ?? now,
      updatedAt: now,
    };
    this.entries.set(registered.id, registered);
    return registered;
  }

  unregister(id: string): boolean {
    return this.entries.delete(id);
  }

  get(id: string): KnowledgeRegistryEntry | undefined {
    return this.entries.get(id);
  }

  list(type?: string): readonly KnowledgeRegistryEntry[] {
    const values = [...this.entries.values()];
    return type ? values.filter((entry) => entry.type === type) : values;
  }

  count(): number {
    return this.entries.size;
  }

  health(): {
    total: number;
    healthy: number;
    degraded: number;
    unavailable: number;
  } {
    const entries = this.list();
    return {
      total: entries.length,
      healthy: entries.filter((entry) => entry.health === "healthy").length,
      degraded: entries.filter((entry) => entry.health === "degraded").length,
      unavailable: entries.filter((entry) => entry.health === "unavailable")
        .length,
    };
  }
}