export type EvolutionCapability =
  | "EVOLUTION_CENTER"
  | "DIGITAL_CONSTITUTION_OS"
  | "ENTERPRISE_DECISION_GRAPH"
  | "AI_STRATEGIC_PLANNER"
  | "RESILIENCE_LAB"
  | "GLOBAL_STANDARDS_OBSERVATORY"
  | "ENTERPRISE_CERTIFICATION"
  | "UNIVERSAL_SDK"
  | "LEGACY_PRESERVATION"
  | "ENTERPRISE_GENOME"
  | "KNOWLEDGE_ACADEMY"
  | "ARCHITECTURE_GOVERNANCE"
  | "CAPABILITY_EVOLUTION"
  | "PLATFORM_EVOLUTION_INDEX"
  | "TECHNOLOGY_RADAR"
  | "DEPRECATION_GOVERNANCE"
  | "MIGRATION_ORCHESTRATION"
  | "COMPATIBILITY_MANAGEMENT"
  | "RELEASE_GOVERNANCE"
  | "CHANGE_IMPACT_ANALYSIS"
  | "ARCHITECTURE_REPLAY"
  | "BLUEPRINT_EVOLUTION"
  | "POLICY_EVOLUTION"
  | "MODEL_EVOLUTION"
  | "DATA_EVOLUTION"
  | "PROCESS_EVOLUTION"
  | "ORGANIZATIONAL_MEMORY"
  | "FUTURE_READINESS"
  | "SOVEREIGNTY_COMMAND_CENTER"
  | "EVOLUTION_COMMAND_CENTER";

export interface EvolutionProgram {
  id:string;
  tenantId:string;
  capability:EvolutionCapability;
  code:string;
  name:string;
  owner:string;
  objective:string;
  version:string;
  maturityScore:number;
  readinessScore:number;
  status:"DRAFT"|"ACTIVE"|"PAUSED"|"COMPLETED"|"RETIRED";
  createdAt:string;
  updatedAt:string;
}

export interface EvolutionAssessment {
  id:string;
  programId:string;
  assessmentType:"MATURITY"|"READINESS"|"RISK"|"COMPATIBILITY"|"IMPACT";
  score:number;
  findings:string[];
  recommendations:string[];
  createdAt:string;
}

export interface EvolutionDecision {
  id:string;
  programId:string;
  title:string;
  decision:string;
  rationale:string;
  consequences:string[];
  status:"PROPOSED"|"APPROVED"|"REJECTED"|"SUPERSEDED";
  createdAt:string;
  updatedAt:string;
}