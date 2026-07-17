export type DigitalGenomeIntegrationsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeIntegrationsRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeIntegrationsState;
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

export interface DigitalGenomeIntegrationsStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me In te gr at io ns";
  status: "operational";
  capabilities: string[];
  records: number;
}