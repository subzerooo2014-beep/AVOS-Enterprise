export type DigitalGenomeSecurityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeSecurityRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeSecurityState;
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

export interface DigitalGenomeSecurityStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Se cu ri ty";
  status: "operational";
  capabilities: string[];
  records: number;
}