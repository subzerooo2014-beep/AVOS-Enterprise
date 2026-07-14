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

const strategyM = await load('autonomous-strategy-engine.service.js');
const objectiveM = await load('enterprise-objective-management.service.js');
const portfolioM = await load('portfolio-governance-engine.service.js');

const strategy = new strategyM.AutonomousStrategyEngineService();
const strategyResult = strategy.evaluate(
  'growth strategy',
  [
    {
      id: 'obj-1',
      title: 'Increase revenue',
      owner: 'growth',
      priority: 90,
      targetValue: 100,
      currentValue: 82,
      dueDate: new Date().toISOString(),
      status: 'active',
    },
  ],
  [],
);

if (strategyResult.score !== 82) {
  throw new Error(`Unexpected strategy score: ${strategyResult.score}`);
}

const objectives = new objectiveM.EnterpriseObjectiveManagementService();
const completion = objectives.portfolioProgress([
  {
    id: 'obj-1',
    title: 'Increase revenue',
    owner: 'growth',
    priority: 90,
    targetValue: 100,
    currentValue: 82,
    dueDate: new Date().toISOString(),
    status: 'active',
  },
]);

if (completion !== 82) {
  throw new Error(`Unexpected objective completion: ${completion}`);
}

const portfolio = new portfolioM.PortfolioGovernanceEngineService();
const ranked = portfolio.rank([
  {
    id: 'initiative-1',
    name: 'Strategic initiative',
    strategicFit: 90,
    expectedValue: 200,
    cost: 100,
    riskScore: 20,
    dependencies: [],
  },
]);

if (ranked.length !== 1 || ranked[0].governanceScore <= 0) {
  throw new Error('Portfolio governance ranking failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle F compiled smoke test',
      strategyScore: strategyResult.score,
      objectiveCompletion: completion,
      governanceScore: ranked[0].governanceScore,
    },
    null,
    2,
  ),
);