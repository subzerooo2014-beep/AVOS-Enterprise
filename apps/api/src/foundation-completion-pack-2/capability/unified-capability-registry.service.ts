import { Injectable, NotFoundException } from "@nestjs/common";
import { CapabilityAsset } from "../foundation-pack-2.types";

@Injectable()
export class UnifiedCapabilityRegistryService {
  private readonly capabilities = new Map<string, CapabilityAsset>([
    [
      "capability:foundation-control-plane",
      {
        id: "capability:foundation-control-plane",
        name: "AVOS Foundation Control Plane",
        category: "service",
        version: "1.0.0",
        ownerIdentityId: "identity:foundation-control-plane",
        lifecycleStage: "platform-service",
        trustScore: 95,
        status: "active",
        dependencies: [
          "capability:constitutional-foundation",
          "capability:foundation-governance",
          "capability:enterprise-metadata"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "capability:constitutional-foundation",
      {
        id: "capability:constitutional-foundation",
        name: "Constitutional Foundation",
        category: "engine",
        version: "1.0.0",
        ownerIdentityId: "identity:avos-platform",
        lifecycleStage: "core-engine",
        trustScore: 98,
        status: "active",
        dependencies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "capability:foundation-governance",
      {
        id: "capability:foundation-governance",
        name: "Foundation Governance",
        category: "engine",
        version: "1.0.0",
        ownerIdentityId: "identity:avos-platform",
        lifecycleStage: "core-engine",
        trustScore: 96,
        status: "active",
        dependencies: ["capability:constitutional-foundation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "capability:enterprise-metadata",
      {
        id: "capability:enterprise-metadata",
        name: "Enterprise Metadata Platform",
        category: "service",
        version: "1.0.0",
        ownerIdentityId: "identity:avos-platform",
        lifecycleStage: "platform-service",
        trustScore: 92,
        status: "active",
        dependencies: ["capability:constitutional-foundation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.capabilities.values());
  }

  get(id: string) {
    const capability = this.capabilities.get(id);
    if (!capability) {
      throw new NotFoundException(`Capability not found: ${id}`);
    }
    return capability;
  }

  register(input: Omit<CapabilityAsset, "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const capability: CapabilityAsset = {
      ...input,
      trustScore: Math.max(0, Math.min(100, input.trustScore)),
      dependencies: Array.from(new Set(input.dependencies)),
      createdAt: now,
      updatedAt: now
    };

    this.capabilities.set(capability.id, capability);
    return capability;
  }

  summary() {
    const items = this.list();
    return {
      total: items.length,
      active: items.filter((item) => item.status === "active").length,
      lifecycle: items.reduce<Record<string, number>>((acc, item) => {
        acc[item.lifecycleStage] = (acc[item.lifecycleStage] ?? 0) + 1;
        return acc;
      }, {}),
      averageTrustScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, item) => sum + item.trustScore, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}

