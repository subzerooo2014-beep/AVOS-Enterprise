import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityKnowledgeRecord } from "./capability-intelligence.types";

@Injectable()
export class CapabilityKnowledgeService {
  private readonly records = new Map<string, CapabilityKnowledgeRecord>();

  constructor(private readonly registry: CapabilityRegistryService) {}

  synchronize() {
    for (const capability of this.registry.list()) {
      this.records.set(capability.identity.key, {
        capabilityKey: capability.identity.key,
        summary: capability.purpose.summary,
        businessValue: capability.purpose.businessValue,
        contracts: capability.contracts.map(
          (contract) => `${contract.type}:${contract.name}@${contract.version}`,
        ),
        dependencies: capability.dependencies.map(
          (dependency) =>
            `${dependency.type}:${dependency.capabilityKey}@${dependency.versionRange}`,
        ),
        tags: [...capability.tags],
        lifecycleStage: capability.lifecycleStage,
        operationalStatus: capability.operationalStatus,
        version: capability.version,
        updatedAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      synchronized: this.records.size,
      generatedAt: new Date().toISOString(),
    };
  }

  get(capabilityKey: string) {
    return this.records.get(capabilityKey.toLowerCase()) ?? null;
  }

  list() {
    return [...this.records.values()].map((record) =>
      structuredClone(record),
    );
  }

  search(query: string) {
    const normalized = query.trim().toLowerCase();

    return this.list()
      .map((record) => {
        let score = 0;
        const reasons: string[] = [];

        if (record.capabilityKey.includes(normalized)) {
          score += 40;
          reasons.push("key");
        }

        if (record.summary.toLowerCase().includes(normalized)) {
          score += 30;
          reasons.push("summary");
        }

        if (record.businessValue.toLowerCase().includes(normalized)) {
          score += 20;
          reasons.push("business-value");
        }

        if (record.tags.some((tag) => tag.includes(normalized))) {
          score += 20;
          reasons.push("tags");
        }

        return { record, score, reasons };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score);
  }
}