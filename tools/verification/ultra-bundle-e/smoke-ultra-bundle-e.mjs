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

const planningM = await load('mission-planning-engine.service.js');
const allocationM = await load('adaptive-resource-allocation.service.js');
const readinessM = await load('operational-readiness-intelligence.service.js');

const planning = new planningM.MissionPlanningEngineService();
const plan = planning.plan(
  {
    id: 'mission-smoke',
    objective: 'activate enterprise operations',
    owner: 'operations',
    priority: 90,
    requiredCapabilities: ['coordination', 'execution'],
    dependencies: [],
    status: 'planned',
  },
  [
    {
      name: 'compute',
      available: 100,
      committed: 10,
      unit: 'capacity',
    },
  ],
);

if (!plan.feasible || plan.mission.status !== 'ready') {
  throw new Error('Mission planning smoke test failed');
}

const allocation = new allocationM.AdaptiveResourceAllocationService();
const allocated = allocation.allocate(plan.requiredCapacity, [
  {
    name: 'compute',
    available: 100,
    committed: 10,
    unit: 'capacity',
  },
]);

if (allocation.totalAllocated(allocated) !== plan.requiredCapacity) {
  throw new Error('Adaptive resource allocation smoke test failed');
}

const readiness = new readinessM.OperationalReadinessIntelligenceService();
const readinessResult = readiness.evaluate([
  {
    id: 'ops',
    domain: 'operations',
    health: 90,
    capacity: 85,
    latency: 20,
    observedAt: new Date().toISOString(),
  },
]);

if (readinessResult.readinessScore < 65) {
  throw new Error('Operational readiness smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle E compiled smoke test',
      feasible: plan.feasible,
      requiredCapacity: plan.requiredCapacity,
      readinessScore: readinessResult.readinessScore,
    },
    null,
    2,
  ),
);