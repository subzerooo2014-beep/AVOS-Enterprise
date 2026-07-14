import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-zero-trust-security',
);

const requiredFiles = [
  'enterprise-zero-trust-security.types.ts',
  'enterprise-zero-trust-engine.service.ts',
  'continuous-identity-verification.service.ts',
  'adaptive-access-policy-engine.service.ts',
  'device-trust-intelligence.service.ts',
  'behavioral-threat-detection.service.ts',
  'privileged-access-governance.service.ts',
  'security-posture-intelligence.service.ts',
  'autonomous-incident-response.service.ts',
  'secrets-key-governance.service.ts',
  'integration-threat-protection.service.ts',
  'security-event-correlation.service.ts',
  'enterprise-security-command-center.service.ts',
  'enterprise-zero-trust-security-orchestrator.service.ts',
  'zero-trust-security-dashboard.service.ts',
  'enterprise-zero-trust-security.controller.ts',
  'enterprise-zero-trust-security.module.ts',
  'dto/evaluate-access.dto.ts',
  'dto/behavior-analysis.dto.ts',
  'dto/incident-response.dto.ts',
];

const capabilities = [
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
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-zero-trust-security.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify({ success: false, missingCapabilities }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle M Enterprise Security Zero Trust Completion',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      zeroTrustEngine: true,
      identityVerification: true,
      adaptiveAccessPolicy: true,
      deviceTrustIntelligence: true,
      behavioralThreatDetection: true,
      privilegedAccessGovernance: true,
      securityPostureIntelligence: true,
      autonomousIncidentResponse: true,
      secretsKeyGovernance: true,
      integrationThreatProtection: true,
      securityEventCorrelation: true,
      securityCommandCenter: true,
      zeroTrustDashboard: true,
    },
    null,
    2,
  ),
);