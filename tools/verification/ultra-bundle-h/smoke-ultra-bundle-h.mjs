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

const resilienceM = await load('enterprise-resilience-engine.service.js');
const riskM = await load('operational-risk-intelligence.service.js');
const dependencyM = await load('critical-dependency-mapper.service.js');

const resilience = new resilienceM.EnterpriseResilienceEngineService();
const resilienceResult = resilience.evaluate([
  {
    id: 'signal-1',
    domain: 'api',
    health: 88,
    redundancy: 80,
    recoveryReadiness: 84,
    observedAt: new Date().toISOString(),
  },
]);

if (resilienceResult.resilienceScore < 70) {
  throw new Error('Resilience score smoke test failed');
}

const risk = new riskM.OperationalRiskIntelligenceService();
const riskResult = risk.assess([
  {
    id: 'risk-1',
    domain: 'database',
    probability: 0.4,
    impact: 80,
    detectability: 70,
    mitigation: 'replication',
  },
]);

if (riskResult.ranked.length !== 1) {
  throw new Error('Risk intelligence smoke test failed');
}

const dependencies = new dependencyM.CriticalDependencyMapperService();
const dependencyResult = dependencies.map([
  {
    id: 'db',
    name: 'Database',
    domain: 'data',
    criticality: 95,
    recoveryTimeObjectiveMinutes: 30,
    recoveryPointObjectiveMinutes: 5,
    dependencies: [],
  },
]);

if (dependencyResult.nodes.length !== 1) {
  throw new Error('Dependency mapping smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle H compiled smoke test',
      resilienceScore: resilienceResult.resilienceScore,
      riskExposure: riskResult.totalExposure,
      dependencies: dependencyResult.nodes.length,
    },
    null,
    2,
  ),
);