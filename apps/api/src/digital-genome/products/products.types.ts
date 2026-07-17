export type DigitalGenomeProductsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeProductsRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeProductsState;
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

export interface DigitalGenomeProductsStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Pr od uc ts";
  status: "operational";
  capabilities: string[];
  records: number;
}