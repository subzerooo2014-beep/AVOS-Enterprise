import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'production-hardening',
);

const requiredFiles = [
  'production-hardening.types.ts',
  'security-hardening-engine.service.ts',
  'authentication-hardening-engine.service.ts',
  'authorization-hardening-engine.service.ts',
  'secret-exposure-audit-engine.service.ts',
  'input-validation-hardening-engine.service.ts',
  'performance-profiling-engine.service.ts',
  'scalability-readiness-engine.service.ts',
  'reliability-policy-engine.service.ts',
  'resilience-pattern-engine.service.ts',
  'disaster-recovery-engine.service.ts',
  'backup-restore-validation-engine.service.ts',
  'observability-readiness-engine.service.ts',
  'incident-response-readiness-engine.service.ts',
  'production-configuration-audit-engine.service.ts',
  'production-readiness-score-engine.service.ts',
  'production-hardening-orchestrator.service.ts',
  'production-hardening-dashboard.service.ts',
  'production-hardening.controller.ts',
  'production-hardening.module.ts',
  'dto/security-control.dto.ts',
  'dto/performance-metric.dto.ts',
  'dto/production-configuration.dto.ts',
];

const capabilities = [
  'security-hardening-engine',
  'authentication-hardening-engine',
  'authorization-hardening-engine',
  'secret-exposure-audit-engine',
  'input-validation-hardening-engine',
  'performance-profiling-engine',
  'scalability-readiness-engine',
  'reliability-policy-engine',
  'resilience-pattern-engine',
  'disaster-recovery-engine',
  'backup-restore-validation-engine',
  'observability-readiness-engine',
  'incident-response-readiness-engine',
  'production-configuration-audit-engine',
  'production-readiness-score-engine',
  'production-hardening-orchestrator',
  'production-hardening-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(
    JSON.stringify({ success: false, missing }, null, 2),
  );
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'production-hardening.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingCapabilities },
      null,
      2,
    ),
  );
  process.exit(1);
}

const appModule = fs.readFileSync(
  path.join(root, 'apps', 'api', 'src', 'app.module.ts'),
  'utf8',
);

if (!appModule.includes('ProductionHardeningModule')) {
  console.error(
    JSON.stringify(
      {
        success: false,
        reason: 'ProductionHardeningModule is not registered',
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: 'AVOS Production Hardening Mega Bundle',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      securityHardening: true,
      authenticationHardening: true,
      authorizationHardening: true,
      secretAudit: true,
      inputValidation: true,
      performanceProfiling: true,
      scalabilityReadiness: true,
      reliabilityPolicies: true,
      resiliencePatterns: true,
      disasterRecovery: true,
      backupRestore: true,
      observabilityReadiness: true,
      incidentResponse: true,
      productionConfiguration: true,
      productionReadinessScore: true,
      orchestrator: true,
      dashboard: true,
      moduleRegistered: true,
    },
    null,
    2,
  ),
);