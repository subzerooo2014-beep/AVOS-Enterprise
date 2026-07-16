import { Injectable, NotFoundException } from "@nestjs/common";
import type { AdvancedTwinRecord } from "./enterprise-advanced-digital-twin.types";

@Injectable()
export class AdvancedTwinRegistryService {
  private readonly twins = new Map<string, AdvancedTwinRecord>();

  upsert(
    input: Omit<AdvancedTwinRecord, "version" | "createdAt" | "updatedAt">,
  ): AdvancedTwinRecord {
    const existing = this.twins.get(input.id);
    const now = new Date().toISOString();

    const twin: AdvancedTwinRecord = {
      ...input,
      state: { ...input.state },
      capabilities: [...input.capabilities],
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.twins.set(twin.id, twin);
    return this.clone(twin);
  }

  updateState(
    id: string,
    patch: Record<string, unknown>,
  ): AdvancedTwinRecord {
    const twin = this.requireTwin(id);
    twin.state = { ...twin.state, ...patch };
    twin.version += 1;
    twin.updatedAt = new Date().toISOString();
    return this.clone(twin);
  }

  setStatus(
    id: string,
    status: AdvancedTwinRecord["status"],
  ): AdvancedTwinRecord {
    const twin = this.requireTwin(id);
    twin.status = status;
    twin.updatedAt = new Date().toISOString();
    return this.clone(twin);
  }

  get(id: string): AdvancedTwinRecord {
    return this.clone(this.requireTwin(id));
  }

  list(): AdvancedTwinRecord[] {
    return Array.from(this.twins.values()).map((twin) => this.clone(twin));
  }

  count(): number {
    return this.twins.size;
  }

  activeCount(): number {
    return this.list().filter((twin) => twin.status === "ACTIVE").length;
  }

  degradedCount(): number {
    return this.list().filter((twin) => twin.status === "DEGRADED").length;
  }

  private requireTwin(id: string): AdvancedTwinRecord {
    const twin = this.twins.get(id);

    if (!twin) {
      throw new NotFoundException(`Advanced digital twin '${id}' was not found.`);
    }

    return twin;
  }

  private clone(twin: AdvancedTwinRecord): AdvancedTwinRecord {
    return {
      ...twin,
      state: { ...twin.state },
      capabilities: [...twin.capabilities],
    };
  }
}
