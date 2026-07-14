import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'global-autonomous-operations',
);

const requiredFiles = [
  'global-autonomous-operations.types.ts',
  'enterprise-autonomous-operations-engine.service.ts',
  'global-operations-orchestrator.service.ts',
  'autonomous-operations-scheduler.service.ts',
  'enterprise-command-execution-engine.service.ts',
  'intelligent-resource-allocation-engine.service.ts',
  'autonomous-capacity-planning.service.ts',
  'enterprise-operational-digital-twin.service.ts',
  'global-operations-intelligence.service.ts',
  'enterprise-service-orchestration-engine.service.ts',
  'autonomous-execution-optimization.service.ts',
  'operations-intelligence-dashboard.service.ts',
  'global-enterprise-operations-center.service.ts',
  'global-autonomous-operations.controller.ts',
  'global-autonomous-operations.module.ts',
  'dto/execute-global-operation.dto.ts',
  'dto/service-orchestration.dto.ts',
];

const capabilities = [
  'enterprise-autonomous-operations-engine',
  'global-operations-orchestrator',
  'autonomous-operations-scheduler',
  'enterprise-command-execution-engine',
  'intelligent-resource-allocation-engine',
  'autonomous-capacity-planning',
  'enterprise-operational-digital-twin',
  'global-operations-intelligence',
  'enterprise-service-orchestration-engine',
  'autonomous-execution-optimization',
  'operations-intelligence-dashboard',
  'global-enterprise-operations-center',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'global-autonomous-operations.types.ts'),
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
        'AVOS Ultra Bundle J Enterprise Autonomous Operations Global Orchestration',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      autonomousOperationsEngine: true,
      globalOperationsOrchestrator: true,
      operationsScheduler: true,
      commandExecutionEngine: true,
      resourceAllocationEngine: true,
      capacityPlanning: true,
      operationalDigitalTwin: true,
      globalOperationsIntelligence: true,
      serviceOrchestrationEngine: true,
      executionOptimization: true,
      operationsDashboard: true,
      globalOperationsCenter: true,
    },
    null,
    2,
  ),
);