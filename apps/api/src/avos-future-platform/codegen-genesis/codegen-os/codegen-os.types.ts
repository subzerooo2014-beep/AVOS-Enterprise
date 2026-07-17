export type CodegenOsStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface CodegenOsCapability {
  id: string;
  name: string;
  group: string;
  status: CodegenOsStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}