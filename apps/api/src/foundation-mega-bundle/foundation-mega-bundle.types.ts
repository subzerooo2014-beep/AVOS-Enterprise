export type FoundationDomain =
  | "VISION"
  | "BRAND"
  | "DESIGN_SYSTEM"
  | "CONSTITUTION"
  | "STRATEGY"
  | "PLATFORM"
  | "ARCHITECTURE"
  | "PRODUCT"
  | "PRODUCTION";

export type LifecycleStage =
  | "DISCOVERY"
  | "FOUNDATION"
  | "ARCHITECTURE"
  | "BUILD"
  | "VALIDATION"
  | "RELEASE"
  | "OPERATIONS"
  | "EVOLUTION";

export interface FoundationMasterRecord {
  id: string;
  code: string;
  name: string;
  domain: FoundationDomain;
  owner: string;
  version: string;
  mandatory: boolean;
  dependencies: string[];
  evidence: string[];
  status: "DRAFT" | "ACTIVE" | "DEPRECATED";
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureDecisionRecord {
  id: string;
  code: string;
  title: string;
  context: string;
  decision: string;
  consequences: string[];
  status: "PROPOSED" | "ACCEPTED" | "SUPERSEDED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface ProductLifecycleRecord {
  id: string;
  productName: string;
  owner: string;
  currentStage: LifecycleStage;
  completedStages: LifecycleStage[];
  foundationRecords: string[];
  architectureDecisions: string[];
  qualityGates: Record<string, boolean>;
  releaseApproved: boolean;
  createdAt: string;
  updatedAt: string;
}