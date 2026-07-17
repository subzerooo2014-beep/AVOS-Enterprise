export type DependencyResolverState = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export interface DependencyResolverRecord {
  id: string;
  name: string;
  description: string;
  score: number;
  state: DependencyResolverState;
  dependency: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DependencyResolverStatus {
  system: "AVOS Enterprise Dependency Graph";
  layer: "Relationship Resolver";
  status: "operational";
  capabilities: string[];
  records: number;
}