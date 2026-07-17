export type DigitalDnaIdentityState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaIdentityRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaIdentityState;
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

export interface DigitalDnaIdentityStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aI de nt it y";
  status: "operational";
  capabilities: string[];
  records: number;
}