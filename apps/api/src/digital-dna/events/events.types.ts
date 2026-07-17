export type DigitalDnaEventsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaEventsRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaEventsState;
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

export interface DigitalDnaEventsStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aE ve nt s";
  status: "operational";
  capabilities: string[];
  records: number;
}