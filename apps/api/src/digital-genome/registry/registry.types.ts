export type DigitalGenomeRegistryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeRegistryRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeRegistryState;
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

export interface DigitalGenomeRegistryStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Re gi st ry";
  status: "operational";
  capabilities: string[];
  records: number;
}