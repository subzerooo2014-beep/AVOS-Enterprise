export type DependencyGraphState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyGraphRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyGraphState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyGraphStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Graph Builder";
  status: "operational";
  capabilities: string[];
  records: number;
}