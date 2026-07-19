export type HabitatStatus = "operational" | "degraded" | "isolated" | "offline";
export type ContinuityLevel = "normal" | "elevated" | "critical" | "civilization-preservation";
export type GovernanceDecision = "pending" | "approved" | "rejected";
export type RecoveryStatus = "planned" | "ready" | "activated" | "completed";

export interface InterplanetaryNode {
  id: string;
  name: string;
  celestialBody: string;
  habitat: string;
  jurisdictionModel: string;
  status: HabitatStatus;
  autonomyScore: number;
  resilienceScore: number;
  trustScore: number;
  availableCapacity: number;
  communicationDelayMinutes: number;
  supportedCapabilities: string[];
  humanAuthorityRequired: boolean;
}

export interface ContinuityScenario {
  id: string;
  name: string;
  level: ContinuityLevel;
  affectedNodeIds: string[];
  requiredCapabilities: string[];
  recoveryStatus: RecoveryStatus;
  requiresHumanApproval: boolean;
  governanceDecision: GovernanceDecision;
  createdAt: string;
  updatedAt: string;
}

export interface RecoveryPlan {
  id: string;
  scenarioId: string;
  selectedNodeIds: string[];
  phases: string[];
  estimatedContinuityScore: number;
  autonomousActions: string[];
  protectedActions: string[];
  status: RecoveryStatus;
  createdAt: string;
}

export interface MemoryArtifact {
  id: string;
  domain: string;
  title: string;
  classification: string;
  preservationTier: number;
  replicationTargets: string[];
  integrityHash: string;
  immutable: boolean;
  createdAt: string;
}

export interface InfrastructureExpansion {
  id: string;
  targetNodeId: string;
  capability: string;
  reason: string;
  projectedCapacityGain: number;
  riskLevel: "low" | "medium" | "high";
  governanceDecision: GovernanceDecision;
  approvedBy?: string;
  status: string;
  createdAt: string;
}

export interface GovernanceEvolutionProposal {
  id: string;
  title: string;
  rationale: string;
  constitutionalCompatibility: boolean;
  humanFinalAuthorityPreserved: boolean;
  globalComplianceReadinessGate: boolean;
  governanceDecision: GovernanceDecision;
  approvedBy?: string;
  status: string;
  createdAt: string;
}