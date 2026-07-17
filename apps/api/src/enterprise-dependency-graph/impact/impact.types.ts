export type DependencyImpactState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyImpactRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyImpactState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyImpactStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Impact Analysis";
  status: "operational";
  capabilities: string[];
  records: number;
}