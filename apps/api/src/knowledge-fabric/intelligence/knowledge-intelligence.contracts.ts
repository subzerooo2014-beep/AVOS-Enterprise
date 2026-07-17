import { KnowledgeIntelligenceRequest, KnowledgeIntelligenceResult } from "./knowledge-intelligence.types";

export interface KnowledgeIntelligenceEngineContract {
  analyze(request: KnowledgeIntelligenceRequest): Promise<KnowledgeIntelligenceResult>;
}

export interface KnowledgeLearningSignal {
  query: string;
  selectedKnowledgeIds: string[];
  rejectedKnowledgeIds?: string[];
  outcome: "SUCCESS" | "PARTIAL" | "FAILURE";
  score?: number;
  metadata?: Record<string, unknown>;
}