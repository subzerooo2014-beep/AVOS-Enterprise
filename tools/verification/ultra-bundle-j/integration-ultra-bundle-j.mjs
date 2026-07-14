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

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === name) {
        return full;
      }
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  engineM,
  schedulerM,
  commandM,
  allocationM,
  serviceM,
  centerM,
  orchestratorM,
  intelligenceM,
  capacityM,
  twinM,
  optimizationM,
  dashboardM,
] = await Promise.all([
  load('enterprise-autonomous-operations-engine.service.js'),
  load('autonomous-operations-scheduler.service.js'),
  load('enterprise-command-execution-engine.service.js'),
  load('intelligent-resource-allocation-engine.service.js'),
  load('enterprise-service-orchestration-engine.service.js'),
  load('global-enterprise-operations-center.service.js'),
  load('global-operations-orchestrator.service.js'),
  load('global-operations-intelligence.service.js'),
  load('autonomous-capacity-planning.service.js'),
  load('enterprise-operational-digital-twin.service.js'),
  load('autonomous-execution-optimization.service.js'),
  load('operations-intelligence-dashboard.service.js'),
]);

const engine =
  new engineM.EnterpriseAutonomousOperationsEngineService();
const scheduler = new schedulerM.AutonomousOperationsSchedulerService();
const commands =
  new commandM.EnterpriseCommandExecutionEngineService();
const resources =
  new allocationM.IntelligentResourceAllocationEngineService();
const services =
  new serviceM.EnterpriseServiceOrchestrationEngineService();
const center =
  new centerM.GlobalEnterpriseOperationsCenterService();

const orchestrator = new orchestratorM.GlobalOperationsOrchestratorService(
  engine,
  scheduler,
  commands,
  resources,
  services,
  center,
);

const operation = {
  id: 'operation-integration',
  name: 'Global enterprise deployment',
  region: 'uae',
  priority: 96,
  requiredCapacity: 80,
  requiredServices: ['api', 'database', 'payments'],
  dependencies: ['identity-ready'],
  status: 'planned',
};

const pools = [
  {
    id: 'uae-primary',
    region: 'uae',
    capacity: 120,
    committed: 20,
    unitCost: 2,
  },
  {
    id: 'uae-secondary',
    region: 'uae',
    capacity: 80,
    committed: 10,
    unitCost: 3,
  },
];

const nodes = [
  {
    id: 'api-1',
    service: 'api',
    region: 'uae',
    health: 95,
    latency: 18,
    capacity: 100,
  },
  {
    id: 'database-1',
    service: 'database',
    region: 'uae',
    health: 92,
    latency: 12,
    capacity: 90,
  },
  {
    id: 'payments-1',
    service: 'payments',
    region: 'uae',
    health: 91,
    latency: 20,
    capacity: 80,
  },
];

const result = orchestrator.run(operation, pools, nodes);

if (result.registered.status !== 'running') {
  throw new Error(`Unexpected operation status: ${result.registered.status}`);
}

if (!result.commandExecutions.length) {
  throw new Error('No operation commands were executed');
}

const intelligence =
  new intelligenceM.GlobalOperationsIntelligenceService();
const intelligenceResult = intelligence.analyze(
  [result.registered],
  pools,
  nodes,
);

const capacity = new capacityM.AutonomousCapacityPlanningService();
const capacityResult = capacity.plan(pools, 25, 20);

const twin = new twinM.EnterpriseOperationalDigitalTwinService();
const twinResult = twin.create(
  [result.registered],
  pools,
  nodes,
);

const optimization =
  new optimizationM.AutonomousExecutionOptimizationService();
const optimized = optimization.optimize([result.registered]);

if (optimized.length !== 1) {
  throw new Error('Execution optimization failed');
}

if (twinResult.regions.length !== 1) {
  throw new Error('Operational digital twin region count mismatch');
}

const dashboard =
  new dashboardM.OperationsIntelligenceDashboardService();
const snapshot = dashboard.snapshot({
  globalReadiness: intelligenceResult.globalReadiness,
  activeOperations: intelligenceResult.active,
  blockedOperations: intelligenceResult.blocked,
  availableCapacity: intelligenceResult.availableCapacity,
  serviceHealth: intelligenceResult.serviceHealth,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Operations dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle J compiled integration test',
      operationStatus: result.registered.status,
      commands: result.commandExecutions.length,
      globalReadiness: intelligenceResult.globalReadiness,
      capacityGap: capacityResult.capacityGap,
      twinRegions: twinResult.regions.length,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);