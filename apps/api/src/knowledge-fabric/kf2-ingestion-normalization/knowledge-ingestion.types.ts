export type KnowledgeInputFormat = "text" | "markdown" | "json";
export type IngestionStatus = "accepted" | "normalized" | "rejected";

export interface IngestKnowledgeInput {
  sourceId?: string;
  source: string;
  format: KnowledgeInputFormat;
  title?: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedKnowledgeDocument {
  id: string;
  sourceId: string;
  source: string;
  format: KnowledgeInputFormat;
  title: string;
  normalizedText: string;
  checksum: string;
  wordCount: number;
  metadata: Record<string, unknown>;
  status: IngestionStatus;
  ingestedAt: string;
}

export interface IngestionBatchResult {
  accepted: number;
  duplicates: number;
  rejected: number;
  documents: NormalizedKnowledgeDocument[];
}

export interface KnowledgeIngestionStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-2";
  name: "Ingestion & Normalization";
  status: "ready";
  pipelineReady: boolean;
  normalizationReady: boolean;
  deduplicationReady: boolean;
  metadataExtractionReady: boolean;
  storedDocuments: number;
  capabilities: string[];
  generatedAt: string;
}