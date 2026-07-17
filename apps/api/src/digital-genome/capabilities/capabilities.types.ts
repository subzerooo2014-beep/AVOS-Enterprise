export type DigitalGenomeCapabilitiesState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeCapabilitiesRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeCapabilitiesState;
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

export interface DigitalGenomeCapabilitiesStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Ca pa bi li ti es";
  status: "operational";
  capabilities: string[];
  records: number;
}