export type DigitalGenomeHealthState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeHealthRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeHealthState;
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

export interface DigitalGenomeHealthStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me He al th";
  status: "operational";
  capabilities: string[];
  records: number;
}