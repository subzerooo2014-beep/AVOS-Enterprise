export type KnowledgeIntelligenceDecision = "ACCEPT" | "REVIEW" | "REJECT";

export interface KnowledgeIntelligenceItem {
  knowledgeId: string;
  key: string;
  name: string;
  namespace: string;
  content: unknown;
  tags: string[];
  trustScore: number;
  confidenceScore: number;
  version: number;
}

export interface KnowledgeIntelligenceRequest {
  query: string;
  namespace?: string;
  tags?: string[];
  limit?: number;
  minimumConfidence?: number;
  includeInsights?: boolean;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeSemanticMatch {
  item: KnowledgeIntelligenceItem;
  semanticScore: number;
  lexicalScore: number;
  tagScore: number;
  finalScore: number;
  reasons: string[];
}

export interface KnowledgeConflict {
  id: string;
  leftKnowledgeId: string;
  rightKnowledgeId: string;
  field: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  explanation: string;
  detectedAt: string;
}

export interface KnowledgeGap {
  id: string;
  query: string;
  namespace?: string;
  missingConcepts: string[];
  severity: "LOW" | "MEDIUM" | "HIGH";
  recommendation: string;
  detectedAt: string;
}

export interface KnowledgeInsight {
  id: string;
  type: "PATTERN" | "RELATIONSHIP" | "RISK" | "OPPORTUNITY" | "SUMMARY";
  title: string;
  description: string;
  supportingKnowledgeIds: string[];
  confidence: number;
  generatedAt: string;
}

export interface KnowledgeIntelligenceResult {
  success: boolean;
  correlationId: string;
  matches: KnowledgeSemanticMatch[];
  conflicts: KnowledgeConflict[];
  gaps: KnowledgeGap[];
  insights: KnowledgeInsight[];
  confidence: number;
  decision: KnowledgeIntelligenceDecision;
  processingTimeMs: number;
}