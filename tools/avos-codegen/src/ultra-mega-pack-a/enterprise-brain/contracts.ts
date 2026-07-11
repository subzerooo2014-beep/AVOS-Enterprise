import {
  UltraValue,
} from "../contracts";

export interface BrainKnowledgeRecord {
  id: string;
  namespace: string;
  topic: string;
  summary: string;
  facts: Record<string, UltraValue>;
  confidence: number;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrainLearningSignal {
  namespace: string;
  topic: string;
  facts: Record<string, UltraValue>;
  confidence: number;
  source: string;
}

export interface BrainLearningResult {
  inserted: number;
  updated: number;
  merged: number;
  records: BrainKnowledgeRecord[];
  learnedAt: string;
}

export interface BrainQuery {
  namespace?: string;
  topic?: string;
  minimumConfidence?: number;
  text?: string;
}

export interface BrainQueryResult {
  records: BrainKnowledgeRecord[];
  total: number;
  generatedAt: string;
}
