export type ArchitectureCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureCertificationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureCertificationState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureCertificationStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eC er ti fi ca ti on";
  status: "operational";
  capabilities: string[];
  records: number;
}