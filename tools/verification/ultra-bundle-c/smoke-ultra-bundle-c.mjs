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

const genomeM = await load('architecture-genome.service.js');
const debtM = await load('technical-debt-manager.service.js');
const dashboardM = await load(
  'architecture-intelligence-dashboard.service.js',
);

const genome = new genomeM.ArchitectureGenomeService();

if (typeof genome.generate !== 'function') {
  throw new Error('ArchitectureGenomeService.generate was not found');
}

const signals = [
  {
    id: 'architecture-signal-1',
    domain: 'architecture',
    source: 'foundation-smoke',
    value: 84,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
  {
    id: 'governance-signal-1',
    domain: 'governance',
    source: 'foundation-smoke',
    value: 81,
    confidence: 0.85,
    observedAt: new Date().toISOString(),
  },
];

const genomeResult = genome.generate(signals);

if (!genomeResult) {
  throw new Error('Architecture genome generation failed');
}

const debt = new debtM.TechnicalDebtManagerService();

if (typeof debt !== 'object') {
  throw new Error('Technical debt manager construction failed');
}

const dashboard =
  new dashboardM.ArchitectureIntelligenceDashboardService();

if (typeof dashboard.snapshot !== 'function') {
  throw new Error(
    'ArchitectureIntelligenceDashboardService.snapshot was not found',
  );
}

const snapshot = dashboard.snapshot();

if (!snapshot) {
  throw new Error('Architecture dashboard snapshot failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle C compiled smoke test',
      architectureGenome: true,
      generatedGenome: Boolean(genomeResult),
      technicalDebtManager: true,
      dashboard: true,
    },
    null,
    2,
  ),
);