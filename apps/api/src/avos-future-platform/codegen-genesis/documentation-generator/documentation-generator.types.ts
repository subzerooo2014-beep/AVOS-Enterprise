export type DocumentationGeneratorStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface DocumentationGeneratorCapability {
  id: string;
  name: string;
  group: string;
  status: DocumentationGeneratorStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}