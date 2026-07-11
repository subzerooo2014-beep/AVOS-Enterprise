import { UltraBFinding, UltraBValue } from "../contracts";

export interface SecurityAsset {
  key: string;
  kind: string;
  criticality: number;
  trustLevel: number;
  controls: string[];
  metadata: Record<string, UltraBValue>;
}

export interface SecurityThreat {
  key: string;
  description: string;
  probability: number;
  impact: number;
  targetAssets: string[];
}

export interface SecurityAssessment {
  score: number;
  riskScore: number;
  findings: UltraBFinding[];
  requiredControls: string[];
  assessedAt: string;
}
