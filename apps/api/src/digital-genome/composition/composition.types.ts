export type DigitalGenomeCompositionState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeCompositionRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeCompositionState;
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

export interface DigitalGenomeCompositionStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Co mp os it io n";
  status: "operational";
  capabilities: string[];
  records: number;
}