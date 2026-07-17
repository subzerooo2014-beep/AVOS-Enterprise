export type IdeaEvolutionEngineStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface IdeaEvolutionEngineCapability {
  id: string;
  name: string;
  group: string;
  status: IdeaEvolutionEngineStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}