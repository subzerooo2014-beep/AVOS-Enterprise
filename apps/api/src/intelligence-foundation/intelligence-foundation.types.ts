export type IntelligenceFoundationStatus = "healthy" | "degraded";

export interface KnowledgeRecord {
  id: string;
  kind: string;
  title: string;
  content: string;
  tags: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeRelation {
  from: string;
  to: string;
  type: string;
  weight: number;
}

export interface LivingBlueprintRecord {
  id: string;
  name: string;
  version: string;
  architectureState: "draft" | "active" | "deprecated";
  runtimeState: "unknown" | "synchronized" | "drifted";
  capabilityIds: string[];
  dependencyIds: string[];
  lastSynchronizedAt?: string;
}

export interface DigitalDnaRecord {
  id: string;
  assetType: string;
  purpose: string;
  version: string;
  status: string;
  dependencies: string[];
  contracts: string[];
  policies: string[];
  permissions: string[];
  events: string[];
  metrics: string[];
  evolutionHistory: Array<{
    version: string;
    change: string;
    changedAt: string;
    approvedBy: string;
  }>;
}

export interface BrainRecommendation {
  id: string;
  title: string;
  rationale: string;
  confidence: number;
  risk: "low" | "medium" | "high";
  requiresHumanApproval: true;
  status: "proposed" | "approved" | "rejected";
  createdAt: string;
}

export interface IntelligenceFoundationVerification {
  version: string;
  classification: string;
  healthy: boolean;
  humanFinalAuthority: true;
  pillars: {
    knowledgeFabric: boolean;
    livingBlueprint: boolean;
    digitalDna: boolean;
    enterpriseBrainFoundation: boolean;
  };
  counts: {
    knowledgeRecords: number;
    knowledgeRelations: number;
    blueprints: number;
    digitalDnaAssets: number;
    recommendations: number;
  };
  checks: string[];
}
