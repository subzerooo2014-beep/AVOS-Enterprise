export type DigitalGenomeCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DigitalGenomeCertificationRecord {
  id: string;
  genomeId: string;
  name: string;
  description: string;
  owner: string;
  state: DigitalGenomeCertificationState;
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

export interface DigitalGenomeCertificationStatus {
  system: "AVOS Digital Genome";
  layer: "D ig it al Ge no me Ce rt if ic at io n";
  status: "operational";
  capabilities: string[];
  records: number;
}