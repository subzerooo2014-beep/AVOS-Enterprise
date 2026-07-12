import { UltraCValue } from "../contracts";

export interface KnowledgeEvolutionRecord {
  id: string;
  namespace: string;
  topic: string;
  facts: Record<string, UltraCValue>;
  confidence: number;
  generation: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeEvolutionSignal {
  namespace: string;
  topic: string;
  facts: Record<string, UltraCValue>;
  confidence: number;
  source: string;
}

export interface KnowledgeEvolutionResult {
  inserted: number;
  evolved: number;
  skipped: number;
  records: KnowledgeEvolutionRecord[];
  evolvedAt: string;
}
