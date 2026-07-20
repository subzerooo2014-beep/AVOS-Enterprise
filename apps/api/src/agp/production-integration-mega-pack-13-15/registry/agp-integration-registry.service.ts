import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  IntegrationDescriptor,
} from "../contracts/agp-production-integration.contracts";

@Injectable()
export class AgpIntegrationRegistryService {
  private readonly integrations = new Map<string, IntegrationDescriptor>();

  register(input: {
    key: string;
    name: string;
    kind: "internal" | "external" | "runtime";
    version?: string;
    endpoint?: string;
    capabilities?: string[];
    metadata?: Record<string, string>;
  }): IntegrationDescriptor {
    const now = new Date().toISOString();
    const existing = this.integrations.get(input.key);
    const descriptor: IntegrationDescriptor = {
      id: existing?.id ?? `agp-integration:${randomUUID()}`,
      key: input.key,
      name: input.name,
      kind: input.kind,
      version: input.version ?? "1.0.0",
      endpoint: input.endpoint,
      capabilities: [...(input.capabilities ?? [])],
      status: "active",
      healthScore: 100,
      metadata: { ...(input.metadata ?? {}) },
      registeredAt: existing?.registeredAt ?? now,
      updatedAt: now,
    };
    this.integrations.set(input.key, descriptor);
    return this.clone(descriptor);
  }

  updateHealth(
    key: string,
    healthScore: number,
    status?: "active" | "degraded" | "suspended",
  ) {
    const descriptor = this.require(key);
    descriptor.healthScore = Math.max(0, Math.min(100, healthScore));
    descriptor.status =
      status ??
      (descriptor.healthScore === 100
        ? "active"
        : descriptor.healthScore > 0
          ? "degraded"
          : "suspended");
    descriptor.updatedAt = new Date().toISOString();
    return this.clone(descriptor);
  }

  resolve(key: string) {
    return this.clone(this.require(key));
  }

  list(kind?: "internal" | "external" | "runtime") {
    return [...this.integrations.values()]
      .filter((item) => !kind || item.kind === kind)
      .map((item) => this.clone(item));
  }

  health() {
    const items = [...this.integrations.values()];
    const average =
      items.length === 0
        ? 100
        : Math.round(
            items.reduce((sum, item) => sum + item.healthScore, 0) /
              items.length,
          );
    return {
      status: average === 100 ? "operational" : "degraded",
      integrations: items.length,
      internal: items.filter((item) => item.kind === "internal").length,
      external: items.filter((item) => item.kind === "external").length,
      runtime: items.filter((item) => item.kind === "runtime").length,
      score: average,
      generatedAt: new Date().toISOString(),
    };
  }

  private require(key: string): IntegrationDescriptor {
    const descriptor = this.integrations.get(key);
    if (!descriptor) {
      throw new NotFoundException(`Integration not found: ${key}`);
    }
    return descriptor;
  }

  private clone(
    descriptor: IntegrationDescriptor,
  ): IntegrationDescriptor {
    return JSON.parse(JSON.stringify(descriptor)) as IntegrationDescriptor;
  }
}