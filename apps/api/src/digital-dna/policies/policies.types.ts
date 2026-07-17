export type DigitalDnaPoliciesState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalDnaPoliciesRecord {
  id: string;
  assetType: string;
  assetId: string;
  name: string;
  purpose: string;
  owner: string;
  state: DigitalDnaPoliciesState;
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

export interface DigitalDnaPoliciesStatus {
  system: "AVOS Digital DNA";
  layer: "D ig it al Dn aP ol ic ie s";
  status: "operational";
  capabilities: string[];
  records: number;
}