export const ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES = [
  'enterprise-integration-hub',
  'universal-connector-framework',
  'federation-management-engine',
  'cross-platform-synchronization-engine',
  'enterprise-api-gateway-intelligence',
  'enterprise-event-federation',
  'multi-cloud-integration-coordinator',
  'external-system-trust-manager',
  'enterprise-integration-security-layer',
  'integration-policy-engine',
  'federation-health-monitor',
  'integration-intelligence-dashboard',
  'global-connectivity-center',
] as const;

export type EnterpriseIntegrationFederationCapability =
  (typeof ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES)[number];

export type ConnectorStatus =
  | 'registered'
  | 'active'
  | 'degraded'
  | 'suspended'
  | 'retired';

export interface IntegrationConnector {
  id: string;
  name: string;
  system: string;
  protocol: string;
  region: string;
  trustScore: number;
  healthScore: number;
  latencyMs: number;
  status: ConnectorStatus;
}

export interface FederationNode {
  id: string;
  organization: string;
  region: string;
  identityProvider: string;
  policyVersion: string;
  trustScore: number;
  healthScore: number;
}

export interface SyncRecord {
  id: string;
  sourceSystem: string;
  targetSystem: string;
  entity: string;
  sourceVersion: number;
  targetVersion: number;
  lastSynchronizedAt: string;
}

export interface ApiGatewayRoute {
  id: string;
  path: string;
  target: string;
  latencyMs: number;
  errorRate: number;
  securityScore: number;
  throughput: number;
}

export interface FederatedEvent {
  id: string;
  source: string;
  topic: string;
  version: number;
  occurredAt: string;
  payloadHash: string;
}

export interface IntegrationPolicy {
  id: string;
  name: string;
  minimumTrustScore: number;
  maximumLatencyMs: number;
  maximumErrorRate: number;
  allowedProtocols: string[];
}

export interface IntegrationDashboardSnapshot {
  generatedAt: string;
  integrationHealth: number;
  activeConnectors: number;
  federationHealth: number;
  synchronizationScore: number;
  securityScore: number;
  connectedRegions: number;
  capabilityStatus: Record<
    EnterpriseIntegrationFederationCapability,
    'operational'
  >;
}