export type DigitalGenomeKnowledgeState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeKnowledgeRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeKnowledgeState;
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

export interface DigitalGenomeKnowledgeStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Kn ow le dg e";
  status: "operational";
  capabilities: string[];
  records: number;
}