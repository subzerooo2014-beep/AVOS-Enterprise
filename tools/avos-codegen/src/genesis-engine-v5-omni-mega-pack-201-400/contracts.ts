export enum V5OmniStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5OmniInput {
  systemKey: string;
  enterpriseNetworks: string[];
  jurisdictions: string[];
  markets: string[];
  publicInfrastructureDomains: string[];
  scientificDomains: string[];
  resourceDomains: string[];
  policyPrinciples: string[];
  annualCapitalPool: number;
  enableAutonomousCommerce?: boolean;
  enableScientificDiscovery?: boolean;
  enablePlanetarySimulation?: boolean;
}

export interface V5EnterpriseOsModule {
  key: string;
  category:
    | "operations"
    | "commerce"
    | "governance"
    | "science"
    | "society"
    | "infrastructure";
  autonomyLevel: number;
  dependencies: string[];
}

export interface V5CommerceNetwork {
  market: string;
  participants: string[];
  settlementMode: string;
  dynamicPricing: boolean;
}

export interface V5PolicyRuntime {
  jurisdiction: string;
  principles: string[];
  conflictResolution: string;
  evidenceRequired: boolean;
}

export interface V5ScientificProgram {
  domain: string;
  hypotheses: string[];
  simulationRequired: boolean;
  approvalRequired: boolean;
}

export interface V5PlanetaryScenario {
  key: string;
  assumptions: string[];
  impactScore: number;
  interventionOptions: string[];
}
