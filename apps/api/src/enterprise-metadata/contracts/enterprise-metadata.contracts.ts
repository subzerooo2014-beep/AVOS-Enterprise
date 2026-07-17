export type MetadataAssetType =
  | "module" | "service" | "capability" | "agent" | "workflow"
  | "product" | "decision" | "data-asset" | "integration" | "policy";

export type MetadataStatus = "active" | "deprecated" | "retired";
export type DependencyType = "depends-on" | "owns" | "produces" | "consumes" | "governs" | "invokes" | "contains";

export interface EnterpriseMetadataRecord {
  readonly id: string;
  readonly key: string;
  readonly assetType: MetadataAssetType;
  readonly name: string;
  readonly description?: string;
  readonly version: string;
  readonly status: MetadataStatus;
  readonly owner?: string;
  readonly tags: readonly string[];
  readonly attributes: Readonly<Record<string, unknown>>;
  readonly lineage: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DependencyEdge {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: DependencyType;
  readonly criticality: "low" | "medium" | "high" | "critical";
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface ImpactAnalysisReport {
  readonly id: string;
  readonly assetId: string;
  readonly directDependents: readonly string[];
  readonly transitiveDependents: readonly string[];
  readonly riskLevel: "low" | "medium" | "high" | "critical";
  readonly recommendations: readonly string[];
  readonly generatedAt: string;
}

export interface MetadataHealthReport {
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly assets: number;
  readonly activeAssets: number;
  readonly edges: number;
  readonly orphanAssets: number;
  readonly cyclicDependencies: number;
  readonly findings: readonly string[];
  readonly generatedAt: string;
}

export interface MetadataCertificationRecord {
  readonly id: string;
  readonly reviewId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "conditional" | "rejected";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}
