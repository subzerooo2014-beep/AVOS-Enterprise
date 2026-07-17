export type ArchitectureObservatoryState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureObservatoryRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureObservatoryState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureObservatoryStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eO bs er va to ry";
  status: "operational";
  capabilities: string[];
  records: number;
}