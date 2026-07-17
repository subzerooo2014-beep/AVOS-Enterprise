export type DependencyCertificationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyCertificationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyCertificationState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyCertificationStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Certification";
  status: "operational";
  capabilities: string[];
  records: number;
}