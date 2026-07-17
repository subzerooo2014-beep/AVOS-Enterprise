export type ArchitectureComponentType =
  | "platform"
  | "kernel"
  | "module"
  | "service"
  | "capability"
  | "fabric"
  | "engine"
  | "integration";

export type ArchitectureStatus = "active" | "deprecated" | "retired";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RuleSeverity = "info" | "warning" | "error" | "critical";

export interface ArchitectureComponent {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly type: ArchitectureComponentType;
  readonly layer: string;
  readonly version: string;
  readonly status: ArchitectureStatus;
  readonly owner: string;
  readonly dependencies: readonly string[];
  readonly capabilities: readonly string[];
  readonly contracts: readonly string[];
  readonly policies: readonly string[];
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ArchitectureRule {
  readonly id: string;
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly severity: RuleSeverity;
  readonly enabled: boolean;
  readonly humanApprovalRequired: boolean;
}

export interface ArchitectureFinding {
  readonly id: string;
  readonly componentId?: string;
  readonly ruleKey: string;
  readonly severity: RuleSeverity;
  readonly title: string;
  readonly description: string;
  readonly remediation: string;
  readonly detectedAt: string;
}

export interface ArchitectureAnalysisReport {
  readonly id: string;
  readonly score: number;
  readonly status: "healthy" | "degraded" | "critical";
  readonly architectureComponents: number;
  readonly activeComponents: number;
  readonly dependencyLinks: number;
  readonly driftFindings: number;
  readonly compatibilityFindings: number;
  readonly technicalDebtFindings: number;
  readonly couplingFindings: number;
  readonly upgradeReadinessScore: number;
  readonly riskLevel: RiskLevel;
  readonly findings: readonly ArchitectureFinding[];
  readonly recommendations: readonly string[];
  readonly generatedAt: string;
}

export interface ArchitectureChangeRequest {
  readonly id: string;
  readonly componentId: string;
  readonly changeType: "upgrade" | "replace" | "remove" | "add-dependency" | "remove-dependency";
  readonly description: string;
  readonly proposedVersion?: string;
  readonly targetComponentId?: string;
  readonly requestedBy: string;
  readonly humanApprovalRequired: boolean;
  readonly status: "proposed" | "approved" | "rejected";
  readonly createdAt: string;
}

export interface ChangeImpactReport {
  readonly id: string;
  readonly changeRequestId: string;
  readonly componentId: string;
  readonly directlyImpacted: readonly string[];
  readonly transitivelyImpacted: readonly string[];
  readonly compatibilityRisks: readonly string[];
  readonly governanceRequirements: readonly string[];
  readonly riskLevel: RiskLevel;
  readonly humanApprovalRequired: boolean;
  readonly recommendations: readonly string[];
  readonly generatedAt: string;
}

export interface ArchitectureCertificationRecord {
  readonly id: string;
  readonly reviewId: string;
  readonly status: "certified" | "rejected";
  readonly score: number;
  readonly level: "excellent" | "good" | "conditional" | "rejected";
  readonly blockingFindings: readonly string[];
  readonly certifiedAt: string;
}