import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthCapabilityRegistryService {
  private readonly capabilities = new Map<string, {
    key: string;
    owner: string;
    operations: string[];
    health: "healthy" | "degraded" | "offline";
  }>();

  constructor() {
    [
      {
        key: "adaptive-growth",
        owner: "Adaptive Growth Studio",
        operations: ["analyze", "recommend", "execute", "measure"],
        health: "healthy" as const,
      },
      {
        key: "capability-fabric",
        owner: "Capability Fabric",
        operations: ["resolve", "dispatch", "coordinate"],
        health: "healthy" as const,
      },
      {
        key: "knowledge-fabric",
        owner: "Knowledge Fabric",
        operations: ["retrieve", "synchronize", "evidence"],
        health: "healthy" as const,
      },
      {
        key: "intelligence-fabric",
        owner: "Intelligence Fabric",
        operations: ["reason", "decide", "coordinate-agents"],
        health: "healthy" as const,
      },
      {
        key: "enterprise-brain",
        owner: "Enterprise Brain",
        operations: ["plan", "evaluate", "optimize"],
        health: "healthy" as const,
      },
      {
        key: "enterprise-nervous-system",
        owner: "Enterprise Nervous System",
        operations: ["publish", "route", "observe"],
        health: "healthy" as const,
      },
    ].forEach((item) => this.capabilities.set(item.key, item));
  }

  resolve(key: string) {
    const capability = this.capabilities.get(key);
    if (!capability) {
      throw new Error(`Capability not registered: ${key}`);
    }
    return capability;
  }

  list() {
    return [...this.capabilities.values()];
  }

  status() {
    const values = this.list();
    return {
      status: "operational",
      total: values.length,
      healthy: values.filter((item) => item.health === "healthy").length,
      crossPlatformReady: true,
    };
  }
}