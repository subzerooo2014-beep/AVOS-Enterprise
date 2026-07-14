import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distRoot = path.resolve('apps/api/dist');

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

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  genomeM,
  kernelM,
  principlesM,
  policiesM,
  constitutionM,
  governanceM,
  evolutionM,
  selfDesignM,
  dashboardM,
] = await Promise.all([
  load('architecture-genome.service.js'),
  load('adaptive-architecture-kernel.service.js'),
  load('enterprise-principle-engine.service.js'),
  load('policy-negotiation.service.js'),
  load('constitutional-evolution.service.js'),
  load('governance-evolution.service.js'),
  load('architecture-evolution.service.js'),
  load('self-designing-architecture.service.js'),
  load('architecture-intelligence-dashboard.service.js'),
]);

const genome = new genomeM.ArchitectureGenomeService();
const kernel = new kernelM.AdaptiveArchitectureKernelService();
const principles = new principlesM.EnterprisePrincipleEngineService();
const policies = new policiesM.PolicyNegotiationEngineService();
const constitution = new constitutionM.AutonomousConstitutionalEvolutionService();
const governance = new governanceM.GovernanceEvolutionService(
  principles,
  policies,
  constitution,
);
const evolution = new evolutionM.ContinuousArchitectureEvolutionService();
const selfDesign = new selfDesignM.SelfDesigningArchitectureService(
  genome,
  kernel,
  governance,
  evolution,
);
const dashboard = new dashboardM.ArchitectureIntelligenceDashboardService(evolution);

const result = selfDesign.design(
  'continuous enterprise architecture improvement',
  [
    {
      id: 'integration-1',
      source: 'compiled-integration',
      category: 'governance',
      value: 88,
      confidence: 0.95,
      observedAt: new Date().toISOString(),
    },
  ],
  ['preserve backward compatibility'],
);

if (result.principleScore !== 100) {
  throw new Error(`Unexpected principle score: ${result.principleScore}`);
}
if (result.evolution.sequence !== 1) {
  throw new Error(`Unexpected evolution sequence: ${result.evolution.sequence}`);
}

const snapshot = dashboard.snapshot(result.genome);
if (Object.keys(snapshot.capabilities).length !== 11) {
  throw new Error('Dashboard integration did not expose 11 capabilities');
}

console.log(JSON.stringify({
  success: true,
  test: 'Ultra Bundle C compiled integration test',
  decision: result.decision.outcome,
  evolutionSequence: result.evolution.sequence,
  architectureFitness: snapshot.architectureFitness,
  capabilityCount: Object.keys(snapshot.capabilities).length,
}, null, 2));