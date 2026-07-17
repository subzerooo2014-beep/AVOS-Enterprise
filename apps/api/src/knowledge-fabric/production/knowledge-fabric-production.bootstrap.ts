import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { KnowledgeFabricEventBusAdapter } from "./integrations/knowledge-fabric-event-bus.adapter";
import { KnowledgeFabricHealthService } from "./health/knowledge-fabric-health.service";
import { UnifiedKnowledgeRegistryService } from "./registry/unified-knowledge-registry.service";

@Injectable()
export class KnowledgeFabricProductionBootstrap
  implements OnApplicationBootstrap
{
  constructor(
    private readonly registry: UnifiedKnowledgeRegistryService,
    private readonly health: KnowledgeFabricHealthService,
    private readonly events: KnowledgeFabricEventBusAdapter,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const definitions = [
      {
        id: "knowledge-runtime",
        type: "runtime",
        name: "Unified Knowledge Fabric Runtime",
      },
      {
        id: "knowledge-orchestrator",
        type: "orchestrator",
        name: "Knowledge Fabric Orchestrator",
      },
      {
        id: "knowledge-registry",
        type: "registry",
        name: "Unified Knowledge Registry",
      },
      {
        id: "knowledge-search-pipeline",
        type: "pipeline",
        name: "Unified Search Pipeline",
      },
      {
        id: "knowledge-production-monitoring",
        type: "monitoring",
        name: "Knowledge Fabric Production Monitoring",
      },
      {
        id: "knowledge-production-certification",
        type: "certification",
        name: "Knowledge Fabric Production Certification",
      },
    ] as const;

    for (const definition of definitions) {
      this.registry.register({
        ...definition,
        version: "1.0.0",
        enabled: true,
        health: "healthy",
        metadata: {
          owner: "AVOS Knowledge Fabric",
          stage: "KF-6",
          productionReady: true,
        },
      });
    }

    const integrations = await this.health.initializeIntegrations();
    await this.events.publish("knowledge.fabric.production.initialized", {
      registryEntries: this.registry.count(),
      ...integrations,
    });
  }
}