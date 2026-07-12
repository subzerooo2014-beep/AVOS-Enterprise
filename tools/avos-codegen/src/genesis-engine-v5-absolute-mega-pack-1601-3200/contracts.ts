export enum V5AbsoluteStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5AbsoluteInput {
  systemKey: string;
  worlds: string[];
  federations: string[];
  capabilityDomains: string[];
  innovationDomains: string[];
  lawDomains: string[];
  memoryDomains: string[];
  infrastructureDomains: string[];
  scientificDomains: string[];
  trustPrinciples: string[];
  annualMetaBudget: number;
  enableRecursiveInnovation?: boolean;
  enableInfiniteSimulation?: boolean;
  enableSelfValidation?: boolean;
}

export interface V5WorldModel {
  key: string;
  coherenceScore: number;
  predictionDepthYears: number;
  dependencies: string[];
}

export interface V5FederationNode {
  key: string;
  members: string[];
  consensusThreshold: number;
  proofRequired: boolean;
}

export interface V5InnovationFlow {
  domain: string;
  allocation: number;
  autonomousRebalancing: boolean;
  expectedImpact: number;
}

export interface V5LawRuntime {
  domain: string;
  validationLayers: string[];
  selfRepairEnabled: boolean;
  evidenceRequired: boolean;
}

export interface V5AbsoluteReadiness {
  genesis: number;
  federation: number;
  innovation: number;
  law: number;
  simulation: number;
  memory: number;
  total: number;
}
