export type KnowledgeStatus =
  | "DRAFT"
  | "ACTIVE"
  | "DEPRECATED"
  | "ARCHIVED";

export type KnowledgeClassification =
  | "PUBLIC"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "RESTRICTED";

export type KnowledgeSourceType =
  | "HUMAN"
  | "SYSTEM"
  | "DOCUMENT"
  | "EVENT"
  | "CAPABILITY"
  | "INTEGRATION"
  | "AI_DERIVED";

export type KnowledgeRelationType =
  | "DEPENDS_ON"
  | "DERIVED_FROM"
  | "SUPERSEDES"
  | "SUPPORTS"
  | "CONTRADICTS"
  | "VALIDATES"
  | "IMPLEMENTS"
  | "REFERENCES";

export interface KnowledgeIdentity {
  id: string;
  key: string;
  name: string;
  namespace: string;
  version: number;
}

export interface KnowledgeDNA {
  identity: KnowledgeIdentity;
  purpose: string;
  sourceType: KnowledgeSourceType;
  sourceReference?: string;
  owners: string[];
  tags: string[];
  classification: KnowledgeClassification;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
  checksum: string;
  trustScore: number;
  provenanceScore: number;
  confidenceScore: number;
}

export interface KnowledgeMetadata {
  language?: string;
  region?: string;
  domain?: string;
  capabilityIds: string[];
  productIds: string[];
  policyIds: string[];
  keywords: string[];
  custom: Record<string, string | number | boolean | null>;
}

export interface KnowledgeVersion {
  version: number;
  content: unknown;
  createdAt: string;
  createdBy: string;
  reason: string;
  checksum: string;
}

export interface KnowledgeRelation {
  id: string;
  fromKnowledgeId: string;
  toKnowledgeId: string;
  type: KnowledgeRelationType;
  weight: number;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeRecord {
  dna: KnowledgeDNA;
  metadata: KnowledgeMetadata;
  currentContent: unknown;
  versions: KnowledgeVersion[];
  relations: KnowledgeRelation[];
}

export interface RegisterKnowledgeInput {
  key: string;
  name: string;
  namespace?: string;
  purpose: string;
  sourceType: KnowledgeSourceType;
  sourceReference?: string;
  owners?: string[];
  tags?: string[];
  classification?: KnowledgeClassification;
  content: unknown;
  createdBy: string;
  metadata?: Partial<KnowledgeMetadata>;
}

export interface UpdateKnowledgeInput {
  content: unknown;
  updatedBy: string;
  reason: string;
  tags?: string[];
  classification?: KnowledgeClassification;
  metadata?: Partial<KnowledgeMetadata>;
}

export interface CreateKnowledgeRelationInput {
  fromKnowledgeId: string;
  toKnowledgeId: string;
  type: KnowledgeRelationType;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeRegistrySnapshot {
  total: number;
  active: number;
  draft: number;
  deprecated: number;
  archived: number;
  relations: number;
  versions: number;
  generatedAt: string;
}