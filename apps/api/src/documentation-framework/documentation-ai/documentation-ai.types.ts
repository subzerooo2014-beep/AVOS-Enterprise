export type DocumentationAssetType =
  | "api"
  | "architecture"
  | "capability"
  | "service"
  | "module"
  | "workflow"
  | "policy"
  | "guide"
  | "other";

export type DocumentationSeverity = "low" | "medium" | "high" | "critical";

export type DocumentationJobStatus =
  | "queued"
  | "processing"
  | "requires-human-approval"
  | "completed"
  | "failed";

export interface DocumentationAssetInput {
  id?: string;
  name: string;
  title?: string;
  version?: string;
  type?: DocumentationAssetType;
  content: string;
  description?: string;
  owner?: string;
  tags?: string[];
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

export interface DocumentationGap {
  id: string;
  code: string;
  title: string;
  description: string;
  severity: DocumentationSeverity;
  category: string;
  recommendation: string;
  detectedAt: string;
  resolved: boolean;
}

export interface DocumentationQualityDimension {
  name: string;
  score: number;
  weight: number;
  findings: string[];
  recommendations: string[];
}

export interface DocumentationQualityReport {
  id: string;
  assetId: string;
  score: number;
  status: "excellent" | "good" | "needs-improvement" | "critical";
  dimensions: DocumentationQualityDimension[];
  gaps: DocumentationGap[];
  findings: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface DocumentationImpactResult {
  id: string;
  assetId: string;
  impactedAssets: string[];
  impactedCapabilities: string[];
  impactedModules: string[];
  riskLevel: DocumentationSeverity;
  score: number;
  findings: string[];
  recommendations: string[];
  analyzedAt: string;
}

export interface DocumentationEvolutionRecord {
  id: string;
  assetId: string;
  fromVersion: string;
  toVersion: string;
  changeType: "patch" | "minor" | "major";
  summary: string;
  changes: string[];
  qualityBefore: number;
  qualityAfter: number;
  evolvedAt: string;
}

export interface DocumentationGovernanceDecision {
  id: string;
  assetId: string;
  decision: "approved" | "requires-improvement" | "rejected";
  status: "final" | "requires-human-approval" | "human-approved";
  reason: string;
  qualityScore: number;
  requiresHumanApproval: boolean;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  decidedAt: string;
  humanApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  approvalNotes?: string;
}

export interface DocumentationArtifact {
  id: string;
  title: string;
  format: "markdown" | "json";
  content: string;
  generatedAt: string;
}

export interface DocumentationJob {
  id: string;
  objective: string;
  status: DocumentationJobStatus;
  assets: DocumentationAssetInput[];
  artifacts: DocumentationArtifact[];
  qualityReports: DocumentationQualityReport[];
  governanceDecisions: DocumentationGovernanceDecision[];
  confidence: number;
  requiresHumanApproval: boolean;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface DocumentationAiStatus {
  name: string;
  version: string;
  status: "operational";
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  metrics: {
    jobs: number;
    completed: number;
    failed: number;
    awaitingHumanApproval: number;
  };
}