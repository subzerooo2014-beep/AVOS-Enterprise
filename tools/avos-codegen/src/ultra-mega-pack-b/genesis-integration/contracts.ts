import {
  UltraBDecision,
  UltraBEvidence,
  UltraBFinding,
} from "../contracts";
import { RuntimeEvolutionResult } from "../self-evolving-runtime";
import { AutonomousTestingReport } from "../autonomous-testing";
import { SecurityAssessment } from "../security-intelligence";
import { DigitalTwinDiff } from "../digital-twin";

export interface GenesisIntegrationInput {
  systemKey: string;
  runtime: RuntimeEvolutionResult;
  testing: AutonomousTestingReport;
  security: SecurityAssessment;
  twinDiff: DigitalTwinDiff;
}

export interface GenesisIntegrationResult {
  success: boolean;
  decision: UltraBDecision;
  score: number;
  controls: string[];
  findings: UltraBFinding[];
  evidence: UltraBEvidence[];
  completedAt: string;
}
