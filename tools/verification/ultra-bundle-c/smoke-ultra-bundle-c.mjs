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

function findExportedClass(module, preferredNames = []) {
  for (const name of preferredNames) {
    if (typeof module[name] === 'function') {
      return module[name];
    }
  }

  const candidate = Object.values(module).find(
    (value) =>
      typeof value === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(value)),
  );

  if (!candidate) {
    throw new Error('No exported class found');
  }

  return candidate;
}

function createDependencyStub() {
  return new Proxy(
    {},
    {
      get(_target, property) {
        if (property === 'history') {
          return () => [];
        }

        if (property === 'snapshot') {
          return () => ({});
        }

        if (property === 'list') {
          return () => [];
        }

        if (property === 'evaluate') {
          return () => [];
        }

        if (property === 'score') {
          return () => 100;
        }

        if (property === 'summary') {
          return () => ({});
        }

        return () => ({});
      },
    },
  );
}

function constructWithStubs(ServiceClass) {
  const dependencyCount = ServiceClass.length;
  const dependencies = Array.from(
    { length: dependencyCount },
    () => createDependencyStub(),
  );

  return new ServiceClass(...dependencies);
}

const genomeModule = await load('architecture-genome.service.js');
const debtModule = await load('technical-debt-manager.service.js');
const dashboardModule = await load(
  'architecture-intelligence-dashboard.service.js',
);

const GenomeService = findExportedClass(genomeModule, [
  'ArchitectureGenomeService',
]);

const DebtService = findExportedClass(debtModule, [
  'TechnicalDebtManagerService',
  'AutonomousTechnicalDebtManagerService',
]);

const DashboardService = findExportedClass(dashboardModule, [
  'ArchitectureIntelligenceDashboardService',
]);

const genome = constructWithStubs(GenomeService);

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

const debt = constructWithStubs(DebtService);

if (!debt || typeof debt !== 'object') {
  throw new Error('Technical debt service construction failed');
}

const dashboard = constructWithStubs(DashboardService);

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
      test: 'Ultra Bundle C runtime smoke test',
      genomeService: GenomeService.name,
      debtService: DebtService.name,
      dashboardService: DashboardService.name,
      constructorDependencies: {
        genome: GenomeService.length,
        debt: DebtService.length,
        dashboard: DashboardService.length,
      },
      architectureGenome: true,
      technicalDebtManager: true,
      dashboard: true,
    },
    null,
    2,
  ),
);