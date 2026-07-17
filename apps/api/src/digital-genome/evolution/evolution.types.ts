export type DigitalGenomeEvolutionState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeEvolutionRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeEvolutionState;
  version: string;
  dnaAssets: string[];
  domains: string[];
  relationships: string[];
  policies: string[];
  metrics: Record<string, number>;
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalGenomeEvolutionStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Ev ol ut io n";
  status: "operational";
  capabilities: string[];
  records: number;
}