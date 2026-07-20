export type CapabilityHealthState = 'operational' | 'degraded' | 'unavailable';

export interface CapabilityRegistration {
  capabilityId: string;
  name: string;
  version: string;
  category: 'production-certification';
  status: CapabilityHealthState;
  foundationFirst: boolean;
  capabilityFirst: boolean;
  blueprintDriven: boolean;
  humanFinalAuthority: boolean;
  globalComplianceReadinessGate: boolean;
  registeredAt: string;
}

export interface CertificationEvidenceSummary {
  expectedDomains: number;
  verifiedDomains: number;
  score: number;
  risk: number;
  state: string;
  deploymentAllowed: boolean;
  digitalTwinReady: boolean;
}

export interface FactoryCapabilityDescriptor {
  capabilityId: string;
  accepts: string[];
  produces: string[];
  orchestrationMode: 'adapter';
  requiresHumanApproval: boolean;
}

export interface UnifiedCertificationContribution {
  source: string;
  score: number;
  certified: boolean;
  blockingIssues: string[];
  humanApprovalRequired: boolean;
  globalComplianceReady: boolean;
}