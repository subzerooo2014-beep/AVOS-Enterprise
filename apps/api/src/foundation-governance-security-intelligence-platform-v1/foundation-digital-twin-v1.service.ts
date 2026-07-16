import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationDigitalTwinV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationDigitalTwinV1Service {
  private readonly twins = new Map<string, FoundationDigitalTwinV1>();

  upsert(
    input: Omit<FoundationDigitalTwinV1, "version" | "createdAt" | "updatedAt">,
  ): FoundationDigitalTwinV1 {
    const existing = this.twins.get(input.id);
    const now = new Date().toISOString();

    const twin: FoundationDigitalTwinV1 = {
      ...input,
      state: { ...input.state },
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.twins.set(twin.id, twin);
    return this.clone(twin);
  }

  synchronize(
    id: string,
    patch: Record<string, unknown>,
  ): FoundationDigitalTwinV1 {
    const twin = this.twins.get(id);

    if (!twin) {
      throw new NotFoundException(`Digital twin '${id}' was not found.`);
    }

    twin.state = { ...twin.state, ...patch };
    twin.version += 1;
    twin.updatedAt = new Date().toISOString();

    return this.clone(twin);
  }

  list(): FoundationDigitalTwinV1[] {
    return Array.from(this.twins.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.twins.size;
  }

  private clone(item: FoundationDigitalTwinV1): FoundationDigitalTwinV1 {
    return { ...item, state: { ...item.state } };
  }
}
