export type DependencyAutomationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyAutomationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyAutomationState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyAutomationStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Dependency Automation";
  status: "operational";
  capabilities: string[];
  records: number;
}