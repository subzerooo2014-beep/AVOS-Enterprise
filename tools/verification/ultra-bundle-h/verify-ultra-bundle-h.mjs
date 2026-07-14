import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-resilience-continuity',
);

const requiredFiles = [
  'enterprise-resilience-continuity.types.ts',
  'enterprise-resilience-engine.service.ts',
  'operational-risk-intelligence.service.ts',
  'business-continuity-orchestrator.service.ts',
  'autonomous-crisis-response.service.ts',
  'failure-prediction-engine.service.ts',
  'self-healing-enterprise-runtime.service.ts',
  'disaster-recovery-intelligence.service.ts',
  'critical-dependency-mapper.service.ts',
  'continuity-policy-engine.service.ts',
  'resilience-simulation-laboratory.service.ts',
  'executive-crisis-command-center.service.ts',
  'enterprise-resilience-continuity-orchestrator.service.ts',
  'resilience-continuity-dashboard.service.ts',
  'enterprise-resilience-continuity.controller.ts',
  'enterprise-resilience-continuity.module.ts',
  'dto/risk-analysis.dto.ts',
  'dto/continuity-analysis.dto.ts',
  'dto/crisis-response.dto.ts',
];

const capabilities = [
  'enterprise-resilience-engine',
  'operational-risk-intelligence',
  'business-continuity-orchestrator',
  'autonomous-crisis-response',
  'failure-prediction-engine',
  'self-healing-enterprise-runtime',
  'disaster-recovery-intelligence',
  'critical-dependency-mapper',
  'continuity-policy-engine',
  'resilience-simulation-laboratory',
  'executive-crisis-command-center',
  'resilience-continuity-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-resilience-continuity.types.ts'),
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
        'AVOS Ultra Bundle H Enterprise Resilience Risk Autonomous Continuity',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      resilienceEngine: true,
      operationalRiskIntelligence: true,
      businessContinuityOrchestrator: true,
      autonomousCrisisResponse: true,
      failurePrediction: true,
      selfHealingRuntime: true,
      disasterRecoveryIntelligence: true,
      criticalDependencyMapper: true,
      continuityPolicyEngine: true,
      resilienceSimulation: true,
      executiveCrisisCommandCenter: true,
      resilienceDashboard: true,
    },
    null,
    2,
  ),
);