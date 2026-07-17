export type BlueprintNodeType =
  | "platform"
  | "kernel"
  | "module"
  | "service"
  | "capability"
  | "fabric"
  | "engine"
  | "integration"
  | "workflow"
  | "agent";

export type BlueprintNodeStatus = "active" | "degraded" | "offline" | "deprecated";
export type BlueprintEdgeType =
  | "depends-on"
  | "provides"
  | "consumes"
  | "emits"
  | "governs"
  | "orchestrates"
  | "contains";

export interface LivingBlueprintNode {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly type: BlueprintNodeType;
  readonly layer: string;
  readonly status: BlueprintNodeStatus;
  readonly version: string;
  readonly owner: string;
  readonly capabilities: readonly string[];
  readonly contracts: readonly string[];
  readonly policies: readonly string[];
  readonly runtime: Readonly<Record<string, unknown>>;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LivingBlueprintEdge {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly type: BlueprintEdgeType;
  readonly critical: boolean;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface LivingBlueprintSnapshot {
  readonly id: string;
  readonly version: number;
  readonly nodes: readonly LivingBlueprintNode[];
  readonly edges: readonly LivingBlueprintEdge[];
  readonly checksum: string;
  readonly source: "declared" | "runtime" | "synchronized";
  readonly generatedAt: string;
}

export interface LivingBlueprintDiff {
  readonly id: string;
  readonly fromSnapshotId: string;
  readonly toSnapshotId: string;
  readonly addedNodes: readonly string[];
  readonly removedNodes: readonly string[];
  readonly changedNodes: readonly string[];
  readonly addedEdges: readonly string[];
  readonly removedEdges: readonly string[];
  readonly generatedAt: string;
}

export interface RuntimeTopology {
  readonly id: string;
  readonly activeNodes: number;
  readonly degradedNodes: number;
  readonly offlineNodes: number;
  readonly dependencyLinks: number;
  readonly criticalLinks: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly policyCount: number;
  readonly generatedAt: string;
}

export interface BlueprintValidationFinding {
  readonly id: string;
  readonly severity: "info" | "warning" | "error" | "critical";
  readonly category:
    | "identity"
    | "dependency"
    | "runtime"
    | "contract"
    | "policy"
    | "consistency";
  readonly title: string;
  readonly description: string;
  readonly remediation: string;
  readonly nodeId?: string;
  readonly edgeId?: string;
  readonly detectedAt: string;
}

export interface LivingBlueprintHealth {
  readonly id: string;
  readonly status: "healthy" | "degraded" | "critical";
  readonly score: number;
  readonly nodes: number;
  readonly activeNodes: number;
  readonly edges: number;
  readonly orphanNodes: number;
  readonly cyclicDependencies: number;
  readonly runtimeCoverage: number;
  readonly contractCoverage: number;
  readonly policyCoverage: number;
  readonly findings: readonly BlueprintValidationFinding[];
  readonly generatedAt: string;
}

export interface LivingBlueprintCertification {
  readonly id: string;
  readonly reviewId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "conditional" | "rejected";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}