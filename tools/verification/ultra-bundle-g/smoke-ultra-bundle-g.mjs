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

const valueM = await load('enterprise-value-intelligence-engine.service.js');
const performanceM = await load('business-performance-intelligence.service.js');
const bottleneckM = await load('enterprise-bottleneck-analyzer.service.js');

const value = new valueM.EnterpriseValueIntelligenceEngineService();
const valueResult = value.analyze(
  [
    {
      id: 'cost-1',
      category: 'operations',
      amount: 400,
      avoidablePercent: 10,
    },
  ],
  [
    {
      id: 'revenue-1',
      stream: 'subscriptions',
      amount: 1000,
      growthRate: 8,
      marginPercent: 60,
    },
  ],
);

if (valueResult.grossValue !== 600) {
  throw new Error(`Unexpected gross value: ${valueResult.grossValue}`);
}

const performance = new performanceM.BusinessPerformanceIntelligenceService();
const performanceResult = performance.analyze([
  {
    id: 'metric-1',
    name: 'Execution rate',
    actual: 82,
    target: 100,
    weight: 1,
    unit: 'percent',
  },
]);

if (performanceResult.score !== 82) {
  throw new Error(`Unexpected performance score: ${performanceResult.score}`);
}

const bottlenecks = new bottleneckM.EnterpriseBottleneckAnalyzerService();
const bottleneckResult = bottlenecks.analyze([
  {
    id: 'stage-1',
    name: 'Approval',
    throughput: 70,
    waitTime: 60,
    errorRate: 10,
  },
]);

if (!bottleneckResult.primaryBottleneck) {
  throw new Error('Bottleneck analysis failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle G compiled smoke test',
      grossValue: valueResult.grossValue,
      performanceScore: performanceResult.score,
      bottleneck: bottleneckResult.primaryBottleneck.id,
    },
    null,
    2,
  ),
);