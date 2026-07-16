import { Injectable, NotFoundException } from "@nestjs/common";
import type { OperationalTwinRecord } from "./enterprise-digital-twin-operations.types";

@Injectable()
export class OperationalTwinRegistryService {
  private readonly twins = new Map<string, OperationalTwinRecord>();

  upsert(
    input: Omit<OperationalTwinRecord, "version" | "createdAt" | "updatedAt">,
  ): OperationalTwinRecord {
    const existing = this.twins.get(input.id);
    const now = new Date().toISOString();

    const twin: OperationalTwinRecord = {
      ...input,
      state: { ...input.state },
      metadata: { ...input.metadata },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.twins.set(twin.id, twin);
    return this.clone(twin);
  }

  applyPatch(
    id: string,
    patch: Record<string, unknown>,
  ): { twin: OperationalTwinRecord; previousVersion: number } {
    const twin = this.requireTwin(id);
    const previousVersion = twin.version;

    twin.state = { ...twin.state, ...patch };
    twin.version += 1;
    twin.updatedAt = new Date().toISOString();

    return {
      twin: this.clone(twin),
      previousVersion,
    };
  }

  get(id: string): OperationalTwinRecord {
    return this.clone(this.requireTwin(id));
  }

  list(): OperationalTwinRecord[] {
    return Array.from(this.twins.values()).map((twin) => this.clone(twin));
  }

  count(): number {
    return this.twins.size;
  }

  countByType(type: OperationalTwinRecord["twinType"]): number {
    return this.list().filter((twin) => twin.twinType === type).length;
  }

  activeCount(): number {
    return this.list().filter((twin) => twin.status === "ACTIVE").length;
  }

  degradedCount(): number {
    return this.list().filter((twin) => twin.status === "DEGRADED").length;
  }

  private requireTwin(id: string): OperationalTwinRecord {
    const twin = this.twins.get(id);

    if (!twin) {
      throw new NotFoundException(`Operational digital twin '${id}' was not found.`);
    }

    return twin;
  }

  private clone(twin: OperationalTwinRecord): OperationalTwinRecord {
    return {
      ...twin,
      state: { ...twin.state },
      metadata: { ...twin.metadata },
    };
  }
}
