export type DigitalGenomeIntelligenceState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeIntelligenceRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeIntelligenceState;
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

export interface DigitalGenomeIntelligenceStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me In te ll ig en ce";
  status: "operational";
  capabilities: string[];
  records: number;
}