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

const zeroTrustM = await load('enterprise-zero-trust-engine.service.js');
const deviceM = await load('device-trust-intelligence.service.js');
const behaviorM = await load('behavioral-threat-detection.service.js');

const zeroTrust = new zeroTrustM.EnterpriseZeroTrustEngineService();

const request = {
  id: 'access-1',
  identity: {
    userId: 'user-1',
    organizationId: 'org-1',
    roles: ['user'],
    authenticationStrength: 95,
    sessionRisk: 10,
    locationRisk: 5,
    verifiedAt: new Date().toISOString(),
  },
  device: {
    deviceId: 'device-1',
    managed: true,
    encrypted: true,
    osPatched: true,
    malwareScore: 0,
    complianceScore: 95,
  },
  resource: 'vehicles',
  action: 'read',
  sensitivity: 20,
};

const access = zeroTrust.evaluate(request, [
  {
    id: 'policy-1',
    name: 'Default',
    minimumIdentityScore: 70,
    minimumDeviceScore: 70,
    maximumSessionRisk: 40,
    privilegedActions: ['delete'],
  },
]);

if (access.decision !== 'allow') {
  throw new Error(`Zero trust smoke test failed: ${access.decision}`);
}

const device = new deviceM.DeviceTrustIntelligenceService();
const deviceResult = device.evaluate(request.device);

if (!deviceResult.trusted) {
  throw new Error('Device trust smoke test failed');
}

const behavior = new behaviorM.BehavioralThreatDetectionService();
const behaviorResult = behavior.analyze([
  {
    id: 'behavior-1',
    actorId: 'user-1',
    event: 'login',
    frequency: 2,
    deviationScore: 5,
    riskScore: 5,
    observedAt: new Date().toISOString(),
  },
]);

if (behaviorResult.highestThreat.severity !== 'low') {
  throw new Error('Behavioral threat smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle M compiled smoke test',
      accessDecision: access.decision,
      zeroTrustScore: access.score,
      deviceTrust: deviceResult.trustScore,
      threatSeverity: behaviorResult.highestThreat.severity,
    },
    null,
    2,
  ),
);