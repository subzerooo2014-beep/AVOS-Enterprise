export const GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES = [
  'global-ecosystem-intelligence-engine',
  'enterprise-partner-intelligence',
  'cross-organization-collaboration-engine',
  'global-integration-orchestrator',
  'external-intelligence-fusion-engine',
  'enterprise-api-intelligence-hub',
  'marketplace-intelligence-coordinator',
  'enterprise-federation-engine',
  'global-trust-identity-intelligence',
  'autonomous-partner-lifecycle-manager',
  'ecosystem-intelligence-dashboard',
  'global-ecosystem-command-center',
] as const;

export type GlobalEcosystemIntelligenceCapability =
  (typeof GLOBAL_ECOSYSTEM_INTELLIGENCE_CAPABILITIES)[number];

export type PartnerStatus =
  | 'prospect'
  | 'onboarding'
  | 'active'
  | 'at-risk'
  | 'suspended'
  | 'offboarded';

export interface EcosystemPartner {
  id: string;
  name: string;
  region: string;
  category: string;
  trustScore: number;
  performanceScore: number;
  integrationScore: number;
  status: PartnerStatus;
}

export interface ExternalSignal {
  id: string;
  source: string;
  domain: string;
  value: number;
  confidence: number;
  observedAt: string;
}

export interface ApiEndpointProfile {
  id: string;
  partnerId: string;
  endpoint: string;
  latencyMs: number;
  errorRate: number;
  throughput: number;
  securityScore: number;
}

export interface MarketplaceOpportunity {
  id: string;
  market: string;
  category: string;
  demandScore: number;
  supplyScore: number;
  marginScore: number;
  competitionScore: number;
}

export interface FederationMember {
  id: string;
  organization: string;
  region: string;
  identityProvider: string;
  policyVersion: string;
  trustScore: number;
}

export interface PartnerLifecycleAction {
  partnerId: string;
  action: string;
  reason: string;
  priority: number;
}

export interface EcosystemDashboardSnapshot {
  generatedAt: string;
  ecosystemHealth: number;
  activePartners: number;
  atRiskPartners: number;
  trustScore: number;
  integrationHealth: number;
  opportunityValue: number;
  capabilityStatus: Record<
    GlobalEcosystemIntelligenceCapability,
    'operational'
  >;
}