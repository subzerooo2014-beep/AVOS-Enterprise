export type Phase5Status = "READY" | "RUNNING" | "COMPLETED" | "BLOCKED";
export interface BrainSignal { id: string; domain: string; signal: string; confidence: number; createdAt: string; }
export interface ConstitutionRule { id: string; name: string; principle: string; active: boolean; }