export type AiProductArchitectStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface AiProductArchitectCapability {
  id: string;
  name: string;
  group: string;
  status: AiProductArchitectStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}