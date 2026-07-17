export type ArchitectureRecommendationState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface ArchitectureRecommendationRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: ArchitectureRecommendationState;
  architecture: Record<string, unknown>;
  findings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitectureRecommendationStatus {
  system: "AVOS Architecture Intelligence Engine";
  layer: "A rc hi te ct ur eR ec om me nd at io n";
  status: "operational";
  capabilities: string[];
  records: number;
}