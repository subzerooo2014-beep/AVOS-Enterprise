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

const engineM = await load(
  'enterprise-autonomous-operations-engine.service.js',
);
const schedulerM = await load(
  'autonomous-operations-scheduler.service.js',
);
const allocationM = await load(
  'intelligent-resource-allocation-engine.service.js',
);

const engine =
  new engineM.EnterpriseAutonomousOperationsEngineService();

const operation = {
  id: 'operation-smoke',
  name: 'Regional launch',
  region: 'uae',
  priority: 90,
  requiredCapacity: 50,
  requiredServices: ['api', 'payments'],
  dependencies: [],
  status: 'planned',
};

const pools = [
  {
    id: 'pool-1',
    region: 'uae',
    capacity: 100,
    committed: 20,
    unitCost: 2,
  },
];

const evaluation = engine.evaluate(operation, pools);

if (!evaluation.executable) {
  throw new Error('Autonomous operations engine smoke test failed');
}

const scheduler = new schedulerM.AutonomousOperationsSchedulerService();
const scheduled = scheduler.schedule([operation]);

if (scheduled.length !== 1 || scheduled[0].sequence !== 1) {
  throw new Error('Operations scheduler smoke test failed');
}

const allocation =
  new allocationM.IntelligentResourceAllocationEngineService();
const allocationResult = allocation.allocate(
  operation.requiredCapacity,
  pools,
);

if (!allocationResult.fullyAllocated) {
  throw new Error('Resource allocation smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle J compiled smoke test',
      executable: evaluation.executable,
      readinessScore: evaluation.readinessScore,
      scheduledOperations: scheduled.length,
      totalCost: allocationResult.totalCost,
    },
    null,
    2,
  ),
);