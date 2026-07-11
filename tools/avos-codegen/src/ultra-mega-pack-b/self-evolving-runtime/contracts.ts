import { UltraBFinding, UltraBValue } from "../contracts";

export interface RuntimeMetric {
  key: string;
  value: number;
  threshold: number;
  weight: number;
}

export interface RuntimeEvolutionSignal {
  key: string;
  description: string;
  metrics: RuntimeMetric[];
  metadata: Record<string, UltraBValue>;
}

export interface RuntimeEvolutionAction {
  id: string;
  key: string;
  description: string;
  priority: number;
  automated: boolean;
  controls: string[];
}

export interface RuntimeEvolutionResult {
  healthy: boolean;
  score: number;
  signals: RuntimeEvolutionSignal[];
  actions: RuntimeEvolutionAction[];
  findings: UltraBFinding[];
  evaluatedAt: string;
}
