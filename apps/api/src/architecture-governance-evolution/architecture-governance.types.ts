export const ARCHITECTURE_CAPABILITIES = [
  'ai-architecture-genome',
  'adaptive-architecture-kernel',
  'architecture-synthesis-engine',
  'self-designing-architecture',
  'autonomous-technical-debt-manager',
  'continuous-architecture-evolution',
  'enterprise-principle-engine',
  'policy-negotiation-engine',
  'autonomous-constitutional-evolution',
  'governance-evolution',
  'architecture-intelligence-dashboard',
] as const;

export type ArchitectureCapability = (typeof ARCHITECTURE_CAPABILITIES)[number];

export type ArchitectureRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ArchitectureSignal {
  id: string;
  source: string;
  category: string;
  value: number;
  confidence: number;
  observedAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ArchitectureGenome {
  version: string;
  generatedAt: string;
  dominantPatterns: string[];
  capabilityFitness: Record<ArchitectureCapability, number>;
  constraints: string[];
}

export interface ArchitectureProposal {
  id: string;
  title: string;
  rationale: string;
  targetCapabilities: ArchitectureCapability[];
  expectedFitnessGain: number;
  riskLevel: ArchitectureRiskLevel;
  requiredPrinciples: string[];
  policyConflicts: string[];
  status: 'proposed' | 'negotiating' | 'approved' | 'rejected';
}

export interface TechnicalDebtItem {
  id: string;
  area: string;
  severity: ArchitectureRiskLevel;
  principal: number;
  interestRate: number;
  recommendedAction: string;
  autonomousActionAllowed: boolean;
}

export interface GovernanceDecision {
  id: string;
  proposalId: string;
  outcome: 'approved' | 'rejected' | 'conditional';
  conditions: string[];
  constitutionalVersion: string;
  decidedAt: string;
}

export interface ArchitectureDashboardSnapshot {
  generatedAt: string;
  architectureFitness: number;
  governanceMaturity: number;
  technicalDebtScore: number;
  activeProposals: number;
  approvedEvolutionActions: number;
  capabilities: Record<ArchitectureCapability, 'operational'>;
}