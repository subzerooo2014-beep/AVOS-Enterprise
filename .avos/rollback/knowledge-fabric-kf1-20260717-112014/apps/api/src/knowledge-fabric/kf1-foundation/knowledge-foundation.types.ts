export type KnowledgeAssetStatus = "draft" | "active" | "deprecated" | "archived";

export interface KnowledgeAssetMetadata {
  source?: string;
  owner?: string;
  tags?: string[];
  language?: string;
  contentType?: string;
  createdBy?: string;
  updatedBy?: string;
  [key: string]: unknown;
}

export interface KnowledgeAsset {
  id: string;
  key: string;
  title: string;
  summary?: string;
  status: KnowledgeAssetStatus;
  version: number;
  metadata: KnowledgeAssetMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKnowledgeAssetInput {
  key: string;
  title: string;
  summary?: string;
  status?: KnowledgeAssetStatus;
  metadata?: KnowledgeAssetMetadata;
}

export interface KnowledgeFoundationStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-1";
  name: "Knowledge Foundation";
  status: "ready";
  registryReady: boolean;
  repositoryReady: boolean;
  bootstrapCompleted: boolean;
  assets: number;
  capabilities: string[];
  generatedAt: string;
}