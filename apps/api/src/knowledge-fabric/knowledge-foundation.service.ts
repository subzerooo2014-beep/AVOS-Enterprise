import { Injectable } from "@nestjs/common";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { KnowledgeRegistryService } from "./knowledge-registry.service";

@Injectable()
export class KnowledgeFoundationService {
  constructor(
    private readonly registry: KnowledgeRegistryService,
    private readonly graph: KnowledgeGraphService,
  ) {}

  status() {
    return {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-1 Knowledge Foundation",
      version: "1.0.0",
      foundationFirst: true,
      status: "OPERATIONAL",
      pillars: [
        "KNOWLEDGE_REGISTRY",
        "KNOWLEDGE_DNA",
        "KNOWLEDGE_METADATA",
        "KNOWLEDGE_GRAPH_FOUNDATION",
        "KNOWLEDGE_CONTRACTS",
        "KNOWLEDGE_CLASSIFICATION",
        "KNOWLEDGE_VERSIONING",
        "KNOWLEDGE_DEPENDENCIES",
        "KNOWLEDGE_PROVENANCE",
        "KNOWLEDGE_CHECKSUM",
        "KNOWLEDGE_LIFECYCLE",
        "KNOWLEDGE_TRUST_FOUNDATION",
      ],
      snapshot: this.registry.snapshot(),
    };
  }

  health() {
    const snapshot = this.registry.snapshot();

    return {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-1",
      health: "HEALTHY",
      registryOperational: true,
      graphOperational: Boolean(this.graph),
      snapshot,
      checkedAt: new Date().toISOString(),
    };
  }
}