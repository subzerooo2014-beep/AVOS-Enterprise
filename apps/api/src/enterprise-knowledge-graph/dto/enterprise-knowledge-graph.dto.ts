import {
  KnowledgeEntityStatus,
  KnowledgeEntityType,
  KnowledgeRelationType,
} from "../contracts/enterprise-knowledge-graph.contracts";

export interface CreateKnowledgeEntityDto {
  readonly key: string;
  readonly name: string;
  readonly type: KnowledgeEntityType;
  readonly status?: KnowledgeEntityStatus;
  readonly description?: string;
  readonly layer?: string;
  readonly owner?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly provenance?: Readonly<Record<string, unknown>>;
  readonly trustScore?: number;
  readonly version?: string;
}

export interface UpdateKnowledgeEntityDto {
  readonly name?: string;
  readonly status?: KnowledgeEntityStatus;
  readonly description?: string;
  readonly layer?: string;
  readonly owner?: string;
  readonly tags?: readonly string[];
  readonly attributes?: Readonly<Record<string, unknown>>;
  readonly provenance?: Readonly<Record<string, unknown>>;
  readonly trustScore?: number;
  readonly version?: string;
}

export interface CreateKnowledgeRelationDto {
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: KnowledgeRelationType;
  readonly strength?: number;
  readonly confidence?: number;
  readonly critical?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface KnowledgeSearchDto {
  readonly query?: string;
  readonly types?: readonly KnowledgeEntityType[];
  readonly tags?: readonly string[];
  readonly minimumTrustScore?: number;
}