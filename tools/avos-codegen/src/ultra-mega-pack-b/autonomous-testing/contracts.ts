import { UltraBFinding, UltraBValue } from "../contracts";

export enum AutonomousTestKind {
  UNIT = "unit",
  INTEGRATION = "integration",
  CONTRACT = "contract",
  SECURITY = "security",
  RESILIENCE = "resilience",
  PERFORMANCE = "performance",
}

export interface AutonomousTestCase {
  id: string;
  key: string;
  kind: AutonomousTestKind;
  description: string;
  target: string;
  priority: number;
  metadata: Record<string, UltraBValue>;
}

export interface AutonomousTestExecution {
  testId: string;
  passed: boolean;
  durationMs: number;
  findings: UltraBFinding[];
  executedAt: string;
}

export interface AutonomousTestingReport {
  passed: boolean;
  score: number;
  executions: AutonomousTestExecution[];
  generatedAt: string;
}
