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

const governanceM = await load(
  'enterprise-data-governance-engine.service.js',
);
const qualityM = await load('data-quality-intelligence.service.js');
const fabricM = await load('knowledge-fabric-engine.service.js');

const assets = [
  {
    id: 'asset-1',
    name: 'Vehicle Master',
    domain: 'vehicles',
    owner: 'data-office',
    classification: 'internal',
    qualityScore: 88,
    freshnessMinutes: 30,
    region: 'uae',
  },
];

const governance =
  new governanceM.EnterpriseDataGovernanceEngineService();
const governanceResult = governance.evaluate(assets);

if (governanceResult.governanceScore < 70) {
  throw new Error('Data governance smoke test failed');
}

const quality = new qualityM.DataQualityIntelligenceService();
const qualityResult = quality.analyze(assets);

if (qualityResult.qualityScore < 70) {
  throw new Error('Data quality smoke test failed');
}

const fabric = new fabricM.KnowledgeFabricEngineService();
const fabricResult = fabric.build(
  [
    {
      id: 'entity-1',
      type: 'vehicle',
      label: 'Vehicle',
      domain: 'vehicles',
      confidence: 0.95,
      attributes: {},
    },
  ],
  [],
);

if (fabricResult.entities.length !== 1) {
  throw new Error('Knowledge fabric smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle O compiled smoke test',
      governanceScore: governanceResult.governanceScore,
      qualityScore: qualityResult.qualityScore,
      knowledgeEntities: fabricResult.entities.length,
    },
    null,
    2,
  ),
);