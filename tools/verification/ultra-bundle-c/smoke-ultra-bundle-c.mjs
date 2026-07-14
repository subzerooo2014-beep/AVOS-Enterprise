import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const apiRoot = path.resolve('apps/api');
const distRoot = path.join(apiRoot, 'dist');

function findFile(name) {
  const stack = [distRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.name === name) return full;
    }
  }
  throw new Error(`Compiled file not found: ${name}`);
}

const genomeModule = await import(pathToFileURL(findFile('architecture-genome.service.js')));
const kernelModule = await import(pathToFileURL(findFile('adaptive-architecture-kernel.service.js')));
const debtModule = await import(pathToFileURL(findFile('technical-debt-manager.service.js')));

const genomeService = new genomeModule.ArchitectureGenomeService();
const genome = genomeService.generate([
  {
    id: 'runtime-1',
    source: 'compiled-smoke',
    category: 'resilience',
    value: 84,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
]);

if (Object.keys(genome.capabilityFitness).length !== 11) {
  throw new Error('Architecture genome did not expose 11 capabilities');
}

const kernel = new kernelModule.AdaptiveArchitectureKernelService();
const proposal = kernel.adapt(genome, 'improve runtime resilience');
if (!proposal.targetCapabilities.length) {
  throw new Error('Adaptive kernel returned no target capabilities');
}

const debt = new debtModule.AutonomousTechnicalDebtManagerService();
const ordered = debt.prioritize([
  {
    id: 'low',
    area: 'docs',
    severity: 'low',
    principal: 5,
    interestRate: 1,
    recommendedAction: 'update',
    autonomousActionAllowed: true,
  },
  {
    id: 'high',
    area: 'runtime',
    severity: 'high',
    principal: 20,
    interestRate: 3,
    recommendedAction: 'refactor',
    autonomousActionAllowed: true,
  },
]);

if (ordered[0].id !== 'high') {
  throw new Error('Technical debt prioritization failed');
}

console.log(JSON.stringify({
  success: true,
  test: 'Ultra Bundle C compiled smoke test',
  capabilityCount: 11,
  proposalTargets: proposal.targetCapabilities.length,
  debtPriority: ordered[0].id,
}, null, 2));