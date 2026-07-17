export type DependencyRiskState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyRiskRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyRiskState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyRiskStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Risk Graph";
  status: "operational";
  capabilities: string[];
  records: number;
}