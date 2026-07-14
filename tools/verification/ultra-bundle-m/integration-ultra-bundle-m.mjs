import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

function findFile(name) {
  const stack = [distRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }
  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  zeroTrustM,
  identityM,
  policyM,
  deviceM,
  behaviorM,
  privilegedM,
  postureM,
  responseM,
  commandM,
  orchestratorM,
  secretsM,
  integrationThreatM,
  correlationM,
  dashboardM,
] = await Promise.all([
  load('enterprise-zero-trust-engine.service.js'),
  load('continuous-identity-verification.service.js'),
  load('adaptive-access-policy-engine.service.js'),
  load('device-trust-intelligence.service.js'),
  load('behavioral-threat-detection.service.js'),
  load('privileged-access-governance.service.js'),
  load('security-posture-intelligence.service.js'),
  load('autonomous-incident-response.service.js'),
  load('enterprise-security-command-center.service.js'),
  load('enterprise-zero-trust-security-orchestrator.service.js'),
  load('secrets-key-governance.service.js'),
  load('integration-threat-protection.service.js'),
  load('security-event-correlation.service.js'),
  load('zero-trust-security-dashboard.service.js'),
]);

const zeroTrust = new zeroTrustM.EnterpriseZeroTrustEngineService();
const identity = new identityM.ContinuousIdentityVerificationService();
const policy = new policyM.AdaptiveAccessPolicyEngineService();
const device = new deviceM.DeviceTrustIntelligenceService();
const behavior = new behaviorM.BehavioralThreatDetectionService();
const privileged = new privilegedM.PrivilegedAccessGovernanceService();
const posture = new postureM.SecurityPostureIntelligenceService();
const response = new responseM.AutonomousIncidentResponseService();
const commandCenter = new commandM.EnterpriseSecurityCommandCenterService();

const orchestrator =
  new orchestratorM.EnterpriseZeroTrustSecurityOrchestratorService(
    zeroTrust,
    identity,
    policy,
    device,
    behavior,
    privileged,
    posture,
    response,
    commandCenter,
  );

const request = {
  id: 'access-integration',
  identity: {
    userId: 'admin-1',
    organizationId: 'org-1',
    roles: ['privileged-admin'],
    authenticationStrength: 96,
    sessionRisk: 15,
    locationRisk: 5,
    verifiedAt: new Date().toISOString(),
  },
  device: {
    deviceId: 'managed-device-1',
    managed: true,
    encrypted: true,
    osPatched: true,
    malwareScore: 0,
    complianceScore: 94,
  },
  resource: 'security-policy',
  action: 'override-policy',
  sensitivity: 90,
};

const result = orchestrator.run({
  request,
  baselinePolicy: {
    id: 'baseline',
    name: 'Baseline Zero Trust',
    minimumIdentityScore: 70,
    minimumDeviceScore: 70,
    maximumSessionRisk: 40,
    privilegedActions: ['override-policy'],
  },
  behaviorSignals: [
    {
      id: 'behavior-admin',
      actorId: 'admin-1',
      event: 'override-policy',
      frequency: 1,
      deviationScore: 20,
      riskScore: 25,
      observedAt: new Date().toISOString(),
    },
  ],
  incident: {
    id: 'incident-1',
    title: 'Suspicious integration activity',
    severity: 'high',
    source: 'integration-gateway',
    affectedAssets: ['gateway-1'],
    detectedAt: new Date().toISOString(),
    status: 'detected',
  },
});

if (result.access.decision === 'deny') {
  throw new Error('Privileged zero trust access was unexpectedly denied');
}

if (!result.incidentResponse) {
  throw new Error('Incident response was not created');
}

const secrets = new secretsM.SecretsKeyGovernanceService();
const secretResult = secrets.evaluate([
  {
    id: 'secret-1',
    owner: 'api',
    ageDays: 95,
    rotationDays: 90,
    exposed: false,
  },
]);

if (!secretResult.rotationQueue.includes('secret-1')) {
  throw new Error('Secrets governance failed');
}

const integrationThreat =
  new integrationThreatM.IntegrationThreatProtectionService();
const integrationThreatResult = integrationThreat.assess([
  {
    id: 'integration-1',
    trustScore: 40,
    errorRate: 30,
    anomalyScore: 90,
    securityScore: 45,
  },
]);

if (!integrationThreatResult.blockedIntegrations.includes('integration-1')) {
  throw new Error('Integration threat protection failed');
}

const correlation = new correlationM.SecurityEventCorrelationService();
const correlationResult = correlation.correlate([
  {
    id: 'event-1',
    actorId: 'actor-1',
    source: 'api',
    type: 'login-failure',
    riskScore: 80,
    occurredAt: new Date().toISOString(),
  },
  {
    id: 'event-2',
    actorId: 'actor-1',
    source: 'gateway',
    type: 'token-abuse',
    riskScore: 90,
    occurredAt: new Date().toISOString(),
  },
  {
    id: 'event-3',
    actorId: 'actor-1',
    source: 'identity',
    type: 'mfa-failure',
    riskScore: 85,
    occurredAt: new Date().toISOString(),
  },
]);

if (!correlationResult.suspiciousActors.includes('actor-1')) {
  throw new Error('Security event correlation failed');
}

const dashboard = new dashboardM.ZeroTrustSecurityDashboardService();
const snapshot = dashboard.snapshot({
  zeroTrustScore: result.access.score,
  identityAssurance: result.identity.assuranceScore,
  deviceTrust: result.device.trustScore,
  securityPosture: result.posture.postureScore,
  activeIncidents: result.commandCenter.active,
  privilegedRisk: result.privileged.privilegedRisk,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Security dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle M compiled integration test',
      accessDecision: result.access.decision,
      identityAssurance: result.identity.assuranceScore,
      deviceTrust: result.device.trustScore,
      incidentStatus: result.incidentResponse.nextStatus,
      rotationQueue: secretResult.rotationQueue.length,
      blockedIntegrations:
        integrationThreatResult.blockedIntegrations.length,
      suspiciousActors: correlationResult.suspiciousActors.length,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);