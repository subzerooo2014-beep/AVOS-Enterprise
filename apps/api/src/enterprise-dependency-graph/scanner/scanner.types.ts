export type DependencyScannerState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyScannerRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyScannerState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyScannerStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Scanner";
  status: "operational";
  capabilities: string[];
  records: number;
}