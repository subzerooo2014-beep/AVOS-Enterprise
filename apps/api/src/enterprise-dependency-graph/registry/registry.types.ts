export type DependencyRegistryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyRegistryRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyRegistryState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyRegistryStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Registry";
  status: "operational";
  capabilities: string[];
  records: number;
}