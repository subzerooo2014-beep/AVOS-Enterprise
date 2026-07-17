export type KnowledgeNodeType =
  | "document"
  | "entity"
  | "capability"
  | "concept"
  | "decision"
  | "event";

export type KnowledgeRelationType =
  | "contains"
  | "depends_on"
  | "related_to"
  | "supports"
  | "derived_from"
  | "contradicts"
  | "references";

export interface CreateKnowledgeNodeInput {
  id?: string;
  key: string;
  label: string;
  type: KnowledgeNodeType;
  sourceDocumentId?: string;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeNode extends Required<Omit<CreateKnowledgeNodeInput, "id" | "sourceDocumentId" | "metadata">> {
  id: string;
  sourceDocumentId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKnowledgeRelationInput {
  id?: string;
  fromNodeId: string;
  toNodeId: string;
  type: KnowledgeRelationType;
  weight?: number;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeRelation extends Required<Omit<CreateKnowledgeRelationInput, "id" | "weight" | "metadata">> {
  id: string;
  weight: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface KnowledgeGraphSnapshot {
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
  orphanNodeIds: string[];
  nodeCount: number;
  relationCount: number;
  generatedAt: string;
}

export interface KnowledgeTraversalResult {
  startNodeId: string;
  depth: number;
  nodes: KnowledgeNode[];
  relations: KnowledgeRelation[];
}

export interface KnowledgeGraphStatus {
  system: "AVOS Knowledge Fabric";
  pack: "KF-3";
  name: "Knowledge Graph";
  status: "ready";
  graphReady: boolean;
  traversalReady: boolean;
  integrityReady: boolean;
  semanticLinksReady: boolean;
  nodes: number;
  relations: number;
  capabilities: string[];
  generatedAt: string;
}