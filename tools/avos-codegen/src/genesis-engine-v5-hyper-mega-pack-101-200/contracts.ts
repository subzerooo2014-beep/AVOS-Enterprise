export type V5HyperPrimitive = string | number | boolean | null;
export type V5HyperValue =
  | V5HyperPrimitive
  | V5HyperValue[]
  | { [key: string]: V5HyperValue };

export enum V5HyperStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5HyperEnterpriseInput {
  systemKey: string;
  enterprises: string[];
  capabilities: string[];
  regions: string[];
  knowledgeDomains: string[];
  voiceLanguages: string[];
  edgeDeviceTypes: string[];
  roboticsDomains: string[];
  trustPrinciples: string[];
  annualInnovationBudget: number;
  enableQuantumReadiness?: boolean;
  enableCivilizationSimulation?: boolean;
  enableAutonomousEconomy?: boolean;
}

export interface V5CivilizationNode {
  key: string;
  type: "enterprise" | "capability" | "knowledge" | "region";
  influenceScore: number;
  dependencies: string[];
}

export interface V5EconomicFlow {
  key: string;
  source: string;
  destination: string;
  value: number;
  autonomous: boolean;
}

export interface V5KnowledgeLink {
  source: string;
  target: string;
  sharedConcepts: string[];
  confidence: number;
}

export interface V5TrustPolicy {
  key: string;
  principle: string;
  enforcement: "mandatory" | "adaptive";
  evidenceRequired: boolean;
}

export interface V5FutureReadinessResult {
  architecture: number;
  economy: number;
  knowledge: number;
  trust: number;
  innovation: number;
  total: number;
}
