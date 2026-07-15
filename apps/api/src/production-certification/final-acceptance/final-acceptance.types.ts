export type AcceptanceGateStatus = "PASS" | "WARN" | "FAIL";

export interface AcceptanceGate {
  name: string;
  status: AcceptanceGateStatus;
  required: boolean;
  evidence: string[];
}

export interface FinalAcceptanceSnapshot {
  system: "AVOS Enterprise";
  component: "Final Production Acceptance";
  status: "CERTIFIED" | "CONDITIONAL" | "BLOCKED";
  productionReady: boolean;
  score: number;
  totalGates: number;
  passedGates: number;
  warnedGates: number;
  failedGates: number;
  generatedAt: string;
  gates: AcceptanceGate[];
}