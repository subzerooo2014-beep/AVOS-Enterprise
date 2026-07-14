export type FinalUltraStatus = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  trustScore: number;
  active: boolean;
}

export interface VoiceCapability {
  id: string;
  name: string;
  language: string;
  enabled: boolean;
}

export interface EvolutionAction {
  id: string;
  domain: string;
  action: string;
  confidence: number;
  approved: boolean;
}

export interface CertificationResult {
  name: string;
  passed: boolean;
  score: number;
}