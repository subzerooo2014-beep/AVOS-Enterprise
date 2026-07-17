export type DigitalDnaEvolutionState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaEvolutionRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaEvolutionState;
  version: string;
  attributes: Record<string, unknown>;
  relations: string[];
  policies: string[];
  permissions: string[];
  events: string[];
  metrics: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalDnaEvolutionStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aE vo lu ti on";
  status: "operational";
  capabilities: string[];
  records: number;
}