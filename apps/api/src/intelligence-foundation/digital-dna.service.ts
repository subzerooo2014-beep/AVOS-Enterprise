import { Injectable } from "@nestjs/common";
import { DigitalDnaRecord } from "./intelligence-foundation.types";

@Injectable()
export class DigitalDnaService {
  private readonly assets = new Map<string, DigitalDnaRecord>();

  constructor() {
    const common = {
      version: "1.0.0",
      status: "active",
      dependencies: ["enterprise-kernel", "capability-fabric"],
      contracts: ["status", "verification", "human-approval"],
      policies: ["foundation-first", "human-final-authority"],
      permissions: ["read", "propose"],
      events: ["registered", "verified", "evolved"],
      metrics: ["health", "quality", "trust"],
      evolutionHistory: [
        {
          version: "1.0.0",
          change: "Initial intelligence foundation registration",
          changedAt: new Date().toISOString(),
          approvedBy: "human:khalifa",
        },
      ],
    };

    this.register({
      id: "dna:knowledge-fabric",
      assetType: "platform-capability",
      purpose: "Store, relate, search, and govern reusable enterprise knowledge.",
      ...common,
    });

    this.register({
      id: "dna:living-blueprint",
      assetType: "architecture-capability",
      purpose: "Keep architecture intent synchronized with runtime state.",
      ...common,
    });

    this.register({
      id: "dna:enterprise-brain-foundation",
      assetType: "intelligence-capability",
      purpose: "Create governed recommendations from knowledge and architecture context.",
      ...common,
    });
  }

  register(input: DigitalDnaRecord): DigitalDnaRecord {
    this.assets.set(input.id, input);
    return input;
  }

  findAll(): DigitalDnaRecord[] {
    return [...this.assets.values()];
  }

  findById(id: string): DigitalDnaRecord | undefined {
    return this.assets.get(id);
  }

  evolve(
    id: string,
    version: string,
    change: string,
    approvedBy: string,
  ): DigitalDnaRecord | undefined {
    const asset = this.assets.get(id);
    if (!asset) return undefined;

    const evolved: DigitalDnaRecord = {
      ...asset,
      version,
      evolutionHistory: [
        ...asset.evolutionHistory,
        {
          version,
          change,
          changedAt: new Date().toISOString(),
          approvedBy,
        },
      ],
    };

    this.assets.set(id, evolved);
    return evolved;
  }

  count(): number {
    return this.assets.size;
  }
}
