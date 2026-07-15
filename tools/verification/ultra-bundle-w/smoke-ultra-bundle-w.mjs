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

const healthM = await load('customer-health-score-engine.service.js');
const leadsM = await load('lead-lifecycle-engine.service.js');
const pipelineM = await load('sales-pipeline-intelligence.service.js');

const customer = {
  id: 'customer-1',
  name: 'Customer One',
  email: 'customer@example.com',
  segment: 'standard',
  lifetimeValue: 120000,
  engagementScore: 85,
  satisfactionScore: 90,
  lastActivityAt: new Date().toISOString(),
};

const health = new healthM.CustomerHealthScoreEngineService();
const healthResult = health.score(customer);

if (healthResult.status !== 'healthy') {
  throw new Error('Customer health smoke test failed');
}

const leads = new leadsM.LeadLifecycleEngineService();
const qualified = leads.qualify([
  {
    id: 'lead-1',
    source: 'organic',
    score: 82,
    status: 'new',
  },
]);

if (qualified[0].status !== 'qualified') {
  throw new Error('Lead lifecycle smoke test failed');
}

const pipeline = new pipelineM.SalesPipelineIntelligenceService();
const pipelineResult = pipeline.analyze([
  {
    id: 'opportunity-1',
    customerId: customer.id,
    title: 'Vehicle purchase',
    value: 250000,
    probability: 0.8,
    stage: 'negotiation',
  },
]);

if (pipelineResult.weightedValue !== 200000) {
  throw new Error('Sales pipeline smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle W compiled smoke test',
      healthStatus: healthResult.status,
      leadStatus: qualified[0].status,
      weightedPipeline: pipelineResult.weightedValue,
    },
    null,
    2,
  ),
);