export interface AgpPrinciples {
  foundationFirst: boolean;
  capabilityFirst: boolean;
  blueprintDriven: boolean;
  humanFinalAuthority: boolean;
  aiAssistHumanDecide: boolean;
  noLogicDuplication: boolean;
  sharedEnterpriseServices: boolean;
  adapterBoundaryPreservation: boolean;
  stableCore: boolean;
  eventDriven: boolean;
  apiFirst: boolean;
  globalComplianceReadinessGate: boolean;
}

export interface AgpArchitectureReview {
  id: string;
  name: string;
  vision: string;
  responsibilities: string[];
  outOfScope: string[];
  relationships: Record<string, string>;
  principles: AgpPrinciples;
  status: "passed" | "failed";
  score: number;
  blockingFindings: string[];
  generatedAt: string;
}

export interface AgpGapAnalysis {
  reusable: string[];
  needsEnhancement: string[];
  missing: string[];
  futureRoadmap: string[];
  risks: string[];
}

export interface AgpMap<T = string> {
  name: string;
  items: T[];
  generatedAt: string;
}

export interface AgpCertification {
  id: string;
  name: string;
  version: string;
  status: "certified" | "rejected";
  score: number;
  checks: Record<string, boolean>;
  blockingFindings: string[];
  approvedBy: string;
  certifiedAt: string;
  generatedAt: string;
}