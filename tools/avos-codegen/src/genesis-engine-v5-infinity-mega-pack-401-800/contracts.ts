export enum V5InfinityStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V5InfinityInput {
  systemKey: string;
  civilizations: string[];
  economies: string[];
  agentSocieties: string[];
  scientificDomains: string[];
  infrastructureDomains: string[];
  constitutionalPrinciples: string[];
  resourcePools: string[];
  simulationWorlds: string[];
  annualAutonomyBudget: number;
  enableRecursiveEvolution?: boolean;
  enableSelfCertification?: boolean;
  enableMultiWorldSimulation?: boolean;
}

export interface V5CivilizationKernel {
  key: string;
  autonomyScore: number;
  governanceModel: string;
  dependencies: string[];
}

export interface V5EconomicIntelligenceModel {
  economy: string;
  forecastHorizonYears: number;
  autonomousAllocation: boolean;
  interventionThreshold: number;
}

export interface V5ArchitectureEvolutionPlan {
  key: string;
  currentScore: number;
  targetScore: number;
  transformations: string[];
}

export interface V5AgentSociety {
  key: string;
  roles: string[];
  governance: string;
  memoryMode: string;
}

export interface V5InfinityReadiness {
  civilization: number;
  economy: number;
  science: number;
  infrastructure: number;
  trust: number;
  evolution: number;
  total: number;
}
