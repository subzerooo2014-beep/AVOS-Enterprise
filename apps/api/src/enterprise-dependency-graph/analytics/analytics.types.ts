export type DependencyAnalyticsState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyAnalyticsRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyAnalyticsState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyAnalyticsStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Analytics";
  status: "operational";
  capabilities: string[];
  records: number;
}