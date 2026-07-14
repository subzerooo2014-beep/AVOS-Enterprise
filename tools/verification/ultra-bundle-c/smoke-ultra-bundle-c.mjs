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

function firstConstructor(module, label) {
  const candidate = Object.values(module).find(
    (value) =>
      typeof value === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(value)),
  );

  if (!candidate) {
    throw new Error(`No exported constructor found for ${label}`);
  }

  return candidate;
}

const genomeModule = await load('architecture-genome.service.js');
const debtModule = await load('technical-debt-manager.service.js');
const dashboardModule = await load(
  'architecture-intelligence-dashboard.service.js',
);

const GenomeService = firstConstructor(genomeModule, 'architecture genome');
const DebtService = firstConstructor(debtModule, 'technical debt');
const DashboardService = firstConstructor(
  dashboardModule,
  'architecture dashboard',
);

const genome = new GenomeService();

if (typeof genome.generate !== 'function') {
  throw new Error('Architecture genome generate() was not found');
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

const debt = new DebtService();

if (!debt || typeof debt !== 'object') {
  throw new Error('Technical debt service construction failed');
}

const dashboard = new DashboardService();

if (typeof dashboard.snapshot !== 'function') {
  throw new Error('Architecture dashboard snapshot() was not found');
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
      genomeExport: GenomeService.name,
      debtExport: DebtService.name,
      dashboardExport: DashboardService.name,
      architectureGenome: true,
      technicalDebtManager: true,
      dashboard: true,
    },
    null,
    2,
  ),
);