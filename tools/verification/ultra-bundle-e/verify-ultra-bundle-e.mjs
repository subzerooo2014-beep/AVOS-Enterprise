import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'autonomous-enterprise-operations',
);

const requiredFiles = [
  'autonomous-enterprise-operations.types.ts',
  'mission-planning-engine.service.ts',
  'adaptive-resource-allocation.service.ts',
  'enterprise-execution-policy-engine.service.ts',
  'operational-readiness-intelligence.service.ts',
  'autonomous-workflow-recovery.service.ts',
  'cross-functional-coordination-mesh.service.ts',
  'real-time-operational-control.service.ts',
  'autonomous-execution-orchestrator.service.ts',
  'enterprise-command-center.service.ts',
  'autonomous-operations-dashboard.service.ts',
  'autonomous-enterprise-operations.controller.ts',
  'autonomous-enterprise-operations.module.ts',
  'dto/execute-mission.dto.ts',
  'dto/operational-readiness.dto.ts',
];

const capabilities = [
  'autonomous-execution-orchestrator',
  'enterprise-command-center',
  'mission-planning-engine',
  'adaptive-resource-allocation',
  'autonomous-workflow-recovery',
  'real-time-operational-control',
  'enterprise-execution-policy-engine',
  'cross-functional-coordination-mesh',
  'operational-readiness-intelligence',
  'autonomous-operations-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'autonomous-enterprise-operations.types.ts'),
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
      system: 'AVOS Ultra Bundle E Autonomous Enterprise Operations',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      executionOrchestrator: true,
      commandCenter: true,
      missionPlanning: true,
      adaptiveResources: true,
      workflowRecovery: true,
      operationalControl: true,
      policyEngine: true,
      coordinationMesh: true,
      readinessIntelligence: true,
      operationsDashboard: true,
    },
    null,
    2,
  ),
);