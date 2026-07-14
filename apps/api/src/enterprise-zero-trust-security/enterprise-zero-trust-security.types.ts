export const ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES = [
  'enterprise-zero-trust-engine',
  'continuous-identity-verification',
  'adaptive-access-policy-engine',
  'device-trust-intelligence',
  'behavioral-threat-detection',
  'privileged-access-governance',
  'security-posture-intelligence',
  'autonomous-incident-response',
  'secrets-key-governance',
  'integration-threat-protection',
  'security-event-correlation',
  'enterprise-security-command-center',
  'zero-trust-security-dashboard',
] as const;

export type EnterpriseZeroTrustSecurityCapability =
  (typeof ENTERPRISE_ZERO_TRUST_SECURITY_CAPABILITIES)[number];

export type SecurityDecision = 'allow' | 'challenge' | 'deny';
export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IdentityContext {
  userId: string;
  organizationId: string;
  roles: string[];
  authenticationStrength: number;
  sessionRisk: number;
  locationRisk: number;
  verifiedAt: string;
}

export interface DeviceContext {
  deviceId: string;
  managed: boolean;
  encrypted: boolean;
  osPatched: boolean;
  malwareScore: number;
  complianceScore: number;
}

export interface AccessRequest {
  id: string;
  identity: IdentityContext;
  device: DeviceContext;
  resource: string;
  action: string;
  sensitivity: number;
}

export interface BehaviorSignal {
  id: string;
  actorId: string;
  event: string;
  frequency: number;
  deviationScore: number;
  riskScore: number;
  observedAt: string;
}

export interface SecurityPolicy {
  id: string;
  name: string;
  minimumIdentityScore: number;
  minimumDeviceScore: number;
  maximumSessionRisk: number;
  privilegedActions: string[];
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: ThreatSeverity;
  source: string;
  affectedAssets: string[];
  detectedAt: string;
  status: 'detected' | 'contained' | 'investigating' | 'resolved';
}

export interface SecurityDashboardSnapshot {
  generatedAt: string;
  zeroTrustScore: number;
  identityAssurance: number;
  deviceTrust: number;
  securityPosture: number;
  activeIncidents: number;
  privilegedRisk: number;
  capabilityStatus: Record<
    EnterpriseZeroTrustSecurityCapability,
    'operational'
  >;
}