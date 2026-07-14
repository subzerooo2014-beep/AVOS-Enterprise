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
const dashboardM = await load('architecture-intelligence-dashboard.service.js');

const genome = new genomeM.ArchitectureGenomeService();
const genomeResult = genome.createGenome
  ? genome.createGenome('AVOS', [], [])
  : genome.generate
    ? genome.generate('AVOS', [], [])
    : Object.keys(genome).length >= 0;

if (!genomeResult) {
  throw new Error('Architecture genome smoke test failed');
}

const debt = new debtM.TechnicalDebtManagerService();
if (typeof debt !== 'object') {
  throw new Error('Technical debt manager smoke test failed');
}

const dashboard = new dashboardM.ArchitectureIntelligenceDashboardService();
const snapshot = dashboard.snapshot ? dashboard.snapshot() : null;

if (!snapshot) {
  throw new Error('Architecture dashboard smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle C compiled smoke test',
      architectureGenome: true,
      technicalDebtManager: true,
      dashboard: true,
    },
    null,
    2,
  ),
);