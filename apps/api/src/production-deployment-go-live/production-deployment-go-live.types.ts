export type ProductionCheckState = 'passed' | 'failed' | 'warning';

export interface ProductionReadinessCheck {
  id: string;
  name: string;
  category:
    | 'configuration'
    | 'deployment'
    | 'database'
    | 'security'
    | 'observability'
    | 'recovery'
    | 'cicd'
    | 'go-live';
  state: ProductionCheckState;
  required: boolean;
  message: string;
  checkedAt: string;
  evidence?: Record<string, unknown>;
}

export interface ProductionReadinessStatus {
  name: string;
  version: string;
  status: 'operational' | 'degraded' | 'blocked';
  score: number;
  unresolvedErrors: number;
  unjustifiedWarnings: number;
  foundationFirst: true;
  capabilityFirst: true;
  blueprintDriven: true;
  humanFinalAuthority: true;
  globalComplianceReadinessGate: true;
  radicalErrorResolutionLaw: true;
  zeroDowntimeReady: boolean;
  checks: ProductionReadinessCheck[];
  generatedAt: string;
}

export interface ProductionCertificationRequest {
  approvedBy: string;
  deploymentTarget?: string;
}

export interface ProductionCertificationResult {
  id: string;
  name: string;
  version: string;
  status: 'certified' | 'blocked';
  score: number;
  approvedBy: string;
  deploymentTarget: string;
  unresolvedErrors: number;
  unjustifiedWarnings: number;
  checks: Record<string, boolean>;
  certifiedAt: string;
  evidencePath: string;
}
