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

const cognitionM = await load('enterprise-cognitive-engine.service.js');
const reasoningM = await load('autonomous-reasoning-engine.service.js');
const multiAgentM = await load('multi-agent-decision-intelligence.service.js');

const cognition = new cognitionM.EnterpriseCognitiveEngineService();
const hypotheses = cognition.createHypotheses([
  {
    id: 'signal-1',
    domain: 'operations',
    source: 'smoke',
    value: 84,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
  {
    id: 'signal-2',
    domain: 'finance',
    source: 'smoke',
    value: 76,
    confidence: 0.85,
    observedAt: new Date().toISOString(),
  },
]);

if (hypotheses.length !== 2) {
  throw new Error(`Expected 2 hypotheses, found ${hypotheses.length}`);
}

const reasoning = new reasoningM.AutonomousReasoningEngineService();
const reasoningResult = reasoning.reason(hypotheses);
if (!reasoningResult.dominantHypothesis) {
  throw new Error('No dominant hypothesis was produced');
}

const agents = new multiAgentM.MultiAgentDecisionIntelligenceService();
const consensus = agents.aggregate([
  {
    agent: 'strategy-agent',
    recommendation: 'expand-capacity',
    confidence: 0.86,
    rationale: ['demand increasing'],
  },
  {
    agent: 'finance-agent',
    recommendation: 'expand-capacity',
    confidence: 0.78,
    rationale: ['funding available'],
  },
]);

if (consensus.consensus?.recommendation !== 'expand-capacity') {
  throw new Error('Multi-agent consensus failed');
}

console.log(JSON.stringify({
  success: true,
  test: 'Ultra Bundle D compiled smoke test',
  hypotheses: hypotheses.length,
  dominantHypothesis: reasoningResult.dominantHypothesis.id,
  consensus: consensus.consensus.recommendation,
}, null, 2));