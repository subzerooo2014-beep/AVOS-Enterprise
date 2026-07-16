import { Injectable } from "@nestjs/common";
import { KnowledgeCatalogService } from "./knowledge-catalog.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";

@Injectable()
export class KnowledgeGovernanceService {
  constructor(
    private readonly graph: KnowledgeGraphService,
    private readonly catalog: KnowledgeCatalogService,
  ) {}

  validate() {
    const violations: { code: string; component: string; message: string }[] = [];

    for (const node of this.graph.listNodes()) {
      if (!node.title || !node.content) {
        violations.push({
          code: "KNOWLEDGE_NODE_CONTENT_MISSING",
          component: node.id,
          message: "Knowledge node title or content is missing.",
        });
      }
    }

    for (const edge of this.graph.listEdges()) {
      if (edge.weight < 0 || edge.weight > 1) {
        violations.push({
          code: "KNOWLEDGE_EDGE_WEIGHT_INVALID",
          component: edge.id,
          message: "Knowledge edge weight must be between 0 and 1.",
        });
      }
    }

    for (const document of this.catalog.list()) {
      if (document.version < 1) {
        violations.push({
          code: "KNOWLEDGE_DOCUMENT_VERSION_INVALID",
          component: document.id,
          message: "Knowledge document version must be at least 1.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
