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
const memoryM = await load('enterprise-memory-graph-v2.service.js');

const cognition = new cognitionM.EnterpriseCognitiveEngineService();
const hypotheses = cognition.generateHypotheses([
  {
    id: 'signal-1',
    domain: 'operations',
    source: 'smoke',
    value: 84,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
]);

if (hypotheses.length !== 1) {
  throw new Error('Cognitive engine smoke test failed');
}

const reasoning = new reasoningM.AutonomousReasoningEngineService();
const reasoningResult = reasoning.reason(hypotheses);

if (!reasoningResult.dominantHypothesis) {
  throw new Error('Autonomous reasoning smoke test failed');
}

const memory = new memoryM.EnterpriseMemoryGraphV2Service();
const graph = memory.build(
  [
    {
      id: 'node-1',
      type: 'concept',
      label: 'Operations',
      importance: 90,
      lastAccessedAt: new Date().toISOString(),
      attributes: {},
    },
    {
      id: 'node-2',
      type: 'concept',
      label: 'Resilience',
      importance: 85,
      lastAccessedAt: new Date().toISOString(),
      attributes: {},
    },
  ],
  [
    {
      id: 'edge-1',
      from: 'node-1',
      to: 'node-2',
      relation: 'supports',
      weight: 0.9,
    },
  ],
);

if (graph.graphHealth !== 100) {
  throw new Error('Memory graph smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle N compiled smoke test',
      hypotheses: hypotheses.length,
      reasoningConfidence: reasoningResult.confidence,
      graphHealth: graph.graphHealth,
    },
    null,
    2,
  ),
);