import { Injectable } from "@nestjs/common";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { RagRetrievalService } from "./rag-retrieval.service";

@Injectable()
export class EnterpriseReasoningService {
  private sessions = 0;

  constructor(
    private readonly graph: KnowledgeGraphService,
    private readonly retrieval: RagRetrievalService,
  ) {}

  reason(question: string, entityId?: string) {
    this.sessions += 1;
    const retrieved = this.retrieval.retrieve(question);
    const neighbors = entityId ? this.graph.neighbors(entityId) : [];

    return {
      success: true,
      question,
      evidence: retrieved.context,
      relatedKnowledge: neighbors,
      conclusion:
        retrieved.context.length > 0
          ? "Evidence was retrieved and prepared for an AI decision or response."
          : "No sufficient evidence was found; human review is recommended.",
      confidence: retrieved.context.length > 0 ? 0.8 : 0.25,
      reasonedAt: new Date().toISOString(),
    };
  }

  sessionCount(): number { return this.sessions; }
}
