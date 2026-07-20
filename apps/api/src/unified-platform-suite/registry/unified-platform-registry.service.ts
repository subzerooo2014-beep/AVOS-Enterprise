import { Injectable } from "@nestjs/common";
import { PlatformComponentRecord } from "../contracts/unified-platform.types";

@Injectable()
export class UnifiedPlatformRegistryService {
  private readonly components = new Map<string, PlatformComponentRecord>();

  register(input: Omit<PlatformComponentRecord, "registeredAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const existing = this.components.get(input.id);
    const record: PlatformComponentRecord = {
      ...input,
      registeredAt: existing?.registeredAt ?? now,
      updatedAt: now
    };
    this.components.set(record.id, record);
    return record;
  }

  seedDefaults() {
    const suites = [
      ["marketplace", "AVOS Marketplace Ultra Suite"],
      ["media", "AVOS Media Ultra Suite"],
      ["finance", "AVOS Finance Ultra Suite"],
      ["enterprise-brain", "AVOS Enterprise Brain Ultra Suite"],
      ["global-intelligence", "AVOS Global Intelligence Ultra Suite"]
    ] as const;

    return suites.map(([id, name]) =>
      this.register({
        id,
        type: "suite",
        name,
        version: "1.0.0",
        status: "operational",
        capabilities: [],
        metadata: { integrationMode: "federated" }
      })
    );
  }

  get(id: string) {
    return this.components.get(id) ?? null;
  }

  list(type?: PlatformComponentRecord["type"]) {
    const values = [...this.components.values()];
    return type ? values.filter((item) => item.type === type) : values;
  }

  summary() {
    const values = this.list();
    return {
      total: values.length,
      operational: values.filter((item) => item.status === "operational").length,
      degraded: values.filter((item) => item.status === "degraded").length,
      offline: values.filter((item) => item.status === "offline").length,
      byType: values.reduce<Record<string, number>>((acc, item) => {
        acc[item.type] = (acc[item.type] ?? 0) + 1;
        return acc;
      }, {})
    };
  }
}