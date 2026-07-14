import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { UltraCapability } from "./enterprise-phase-2-ultra.types";

@Injectable()
export class CapabilityFusionService {
  private readonly capabilities = new Map<string, UltraCapability>();

  register(name: string, domain: string, score = 90): UltraCapability {
    const capability: UltraCapability = {
      id: randomUUID(),
      name,
      domain,
      score: Math.min(100, Math.max(0, Math.round(score))),
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    this.capabilities.set(capability.id, capability);
    return capability;
  }

  fuse(names: string[]) {
    const selected = this.list().filter((item) => names.includes(item.name));
    const score = selected.length === 0
      ? 0
      : Math.round(selected.reduce((sum, item) => sum + item.score, 0) / selected.length);

    return {
      active: selected.length >= 2,
      names: selected.map((item) => item.name),
      score,
      fusedAt: new Date().toISOString(),
    };
  }

  list(): UltraCapability[] {
    return [...this.capabilities.values()];
  }

  count(): number {
    return this.capabilities.size;
  }
}