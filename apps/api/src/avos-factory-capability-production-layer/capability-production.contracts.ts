export type CapabilityProductionStatus =
  | "draft"
  | "planned"
  | "generated"
  | "validated"
  | "certified"
  | "packaged"
  | "failed";

export interface CapabilityBlueprint {
  id: string;
  name: string;
  version: string;
  description: string;
  domain: string;
  owners: string[];
  dependencies: string[];
  contracts: string[];
  qualityTargets: {
    minimumScore: number;
    requireHumanApproval: boolean;
  };
  createdAt: string;
}

export interface CapabilitySpecification {
  id: string;
  blueprintId: string;
  capabilityName: string;
  inputs: string[];
  outputs: string[];
  behaviors: string[];
  nonFunctionalRequirements: string[];
  generatedAt: string;
}

export interface CapabilityDependencyPlan {
  id: string;
  blueprintId: string;
  orderedDependencies: string[];
  unresolvedDependencies: string[];
  hasCycle: boolean;
  generatedAt: string;
}

export interface CapabilityGeneratedArtifact {
  id: string;
  blueprintId: string;
  kind: "contract" | "code" | "test";
  name: string;
  content: string;
  checksum: string;
  generatedAt: string;
}

export interface CapabilityGovernanceReport {
  id: string;
  blueprintId: string;
  score: number;
  passed: boolean;
  checks: Record<string, boolean>;
  findings: string[];
  humanApprovalRequired: boolean;
  generatedAt: string;
}

export interface CapabilityProductionCertificate {
  id: string;
  blueprintId: string;
  status: "certified" | "rejected";
  score: number;
  approvedBy: string | null;
  humanFinalAuthority: boolean;
  reportId: string;
  certifiedAt: string;
}

export interface CapabilityReleasePackage {
  id: string;
  blueprintId: string;
  certificateId: string;
  packageName: string;
  version: string;
  artifactIds: string[];
  status: "ready";
  createdAt: string;
}

export interface CapabilityProductionRun {
  id: string;
  blueprintId: string;
  status: CapabilityProductionStatus;
  specificationId?: string;
  dependencyPlanId?: string;
  governanceReportId?: string;
  certificateId?: string;
  releasePackageId?: string;
  artifactIds: string[];
  startedAt: string;
  completedAt?: string;
}
