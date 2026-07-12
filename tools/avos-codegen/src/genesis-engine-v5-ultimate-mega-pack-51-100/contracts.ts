export type V5UltimatePrimitive = string | number | boolean | null;
export type V5UltimateValue =
  | V5UltimatePrimitive
  | V5UltimateValue[]
  | { [key: string]: V5UltimateValue };

export enum V5UltimateStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5UltimateCapability {
  key: string;
  maturity: number;
  criticality: "low" | "medium" | "high";
  dependencies: string[];
}

export interface V5UltimateInput {
  systemKey: string;
  systemName: string;
  capabilities: V5UltimateCapability[];
  strategicGoals: string[];
  standards: string[];
  legacySystems: string[];
  cloudProviders: string[];
  regions: string[];
  governancePrinciples: string[];
  enableSelfEvolution?: boolean;
  enableSimulation?: boolean;
  enableCertification?: boolean;
}

export interface V5DigitalTwinNode {
  key: string;
  type: "capability" | "system" | "goal" | "policy";
  health: number;
  relationships: string[];
}

export interface V5StrategicInitiative {
  key: string;
  goal: string;
  priority: number;
  requiredCapabilities: string[];
  expectedImpact: number;
}

export interface V5SimulationScenario {
  key: string;
  name: string;
  assumptions: string[];
  projectedScore: number;
  risks: string[];
}

export interface V5ConstitutionArticle {
  key: string;
  principle: string;
  enforcement: "mandatory" | "advisory";
  evidenceRequired: boolean;
}

export interface V5CertificationResult {
  scope: string;
  score: number;
  level: "bronze" | "silver" | "gold" | "platinum";
  findings: string[];
}
