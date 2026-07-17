export type KnowledgeEntityType =
  | "platform"
  | "kernel"
  | "module"
  | "service"
  | "capability"
  | "product"
  | "agent"
  | "workflow"
  | "api"
  | "event"
  | "decision"
  | "document"
  | "policy"
  | "data-asset"
  | "knowledge";

export type KnowledgeRelationType =
  | "depends-on"
  | "provides"
  | "consumes"
  | "contains"
  | "governs"
  | "produces"
  | "triggers"
  | "implements"
  | "references"
  | "derived-from"
  | "related-to";

export type KnowledgeEntityStatus = "active" | "draft" | "deprecated" | "archived";

export interface KnowledgeEntity {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly type: KnowledgeEntityType;
  readonly status: KnowledgeEntityStatus;
  readonly description: string;
  readonly layer: string;
  readonly owner: string;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
  readonly provenance: Readonly<Record<string, unknown>>;
  readonly trustScore: number;
  readonly version: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface KnowledgeRelation {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: KnowledgeRelationType;
  readonly strength: number;
  readonly confidence: number;
  readonly critical: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface KnowledgePath {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly entityIds: readonly string[];
  readonly relationIds: readonly string[];
  readonly distance: number;
  readonly generatedAt: string;
}

export interface KnowledgeGraphHealth {
  readonly id: string;
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly entities: number;
  readonly activeEntities: number;
  readonly relations: number;
  readonly orphanEntities: number;
  readonly duplicateKeys: number;
  readonly invalidRelations: number;
  readonly lowTrustEntities: number;
  readonly averageTrustScore: number;
  readonly findings: readonly string[];
  readonly generatedAt: string;
}

export interface KnowledgeGraphInsight {
  readonly id: string;
  readonly category: "structure" | "risk" | "opportunity" | "governance";
  readonly title: string;
  readonly description: string;
  readonly priority: "low" | "medium" | "high" | "critical";
  readonly entityIds: readonly string[];
  readonly generatedAt: string;
}

export interface KnowledgeGraphCertification {
  readonly id: string;
  readonly reviewId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "conditional" | "rejected";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}