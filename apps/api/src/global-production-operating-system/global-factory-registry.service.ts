import { Injectable, OnModuleInit } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { GlobalFactoryNode } from "./global-production-os.types";

@Injectable()
export class GlobalFactoryRegistryService implements OnModuleInit {
  constructor(private readonly store: GlobalProductionOsStore) {}

  onModuleInit(): void {
    if (this.store.factories.size > 0) return;

    const now = this.store.now();
    const seeds: GlobalFactoryNode[] = [
      {
        id: "global-factory:uae-core",
        name: "AVOS UAE Sovereign Production Core",
        region: "middle-east",
        countryCode: "AE",
        jurisdiction: "UAE",
        capabilities: ["ai-production", "software-factory", "mobility", "content"],
        supportedLanguages: ["ar", "en"],
        capacity: 1000,
        currentLoad: 120,
        operationalCostIndex: 62,
        energyCostIndex: 55,
        carbonIntensityIndex: 38,
        latencyIndex: 18,
        healthScore: 100,
        trustScore: 100,
        blueprintCompatibility: 100,
        disasterZone: "me-primary",
        status: "operational",
        sovereignDataClasses: ["public", "internal", "confidential", "regulated"],
        updatedAt: now
      },
      {
        id: "global-factory:eu-west",
        name: "AVOS Europe Production Grid",
        region: "europe",
        countryCode: "DE",
        jurisdiction: "EU",
        capabilities: ["software-factory", "data-platform", "regulated-workloads"],
        supportedLanguages: ["en", "de", "fr"],
        capacity: 800,
        currentLoad: 160,
        operationalCostIndex: 75,
        energyCostIndex: 68,
        carbonIntensityIndex: 28,
        latencyIndex: 22,
        healthScore: 98,
        trustScore: 99,
        blueprintCompatibility: 100,
        disasterZone: "eu-west",
        status: "operational",
        sovereignDataClasses: ["public", "internal", "confidential", "eu-regulated"],
        updatedAt: now
      },
      {
        id: "global-factory:apac-east",
        name: "AVOS Asia Pacific Production Grid",
        region: "asia-pacific",
        countryCode: "SG",
        jurisdiction: "Singapore",
        capabilities: ["ai-production", "software-factory", "analytics"],
        supportedLanguages: ["en", "zh"],
        capacity: 900,
        currentLoad: 210,
        operationalCostIndex: 58,
        energyCostIndex: 61,
        carbonIntensityIndex: 44,
        latencyIndex: 25,
        healthScore: 97,
        trustScore: 98,
        blueprintCompatibility: 99,
        disasterZone: "apac-east",
        status: "operational",
        sovereignDataClasses: ["public", "internal", "confidential"],
        updatedAt: now
      }
    ];

    for (const factory of seeds) {
      this.store.factories.set(factory.id, factory);
    }
  }

  register(input: Omit<GlobalFactoryNode, "id" | "updatedAt">): GlobalFactoryNode {
    const record: GlobalFactoryNode = {
      ...input,
      id: this.store.nextId("global-factory"),
      updatedAt: this.store.now()
    };
    this.store.factories.set(record.id, record);
    return record;
  }

  list(): GlobalFactoryNode[] {
    return [...this.store.factories.values()];
  }

  get(id: string): GlobalFactoryNode | undefined {
    return this.store.factories.get(id);
  }
}