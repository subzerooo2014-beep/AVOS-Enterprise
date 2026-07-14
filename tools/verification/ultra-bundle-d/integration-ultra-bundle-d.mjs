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

const [
  cognitionM,
  reasoningM,
  knowledgeM,
  planningM,
  predictionM,
  fusionM,
  executiveM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('enterprise-cognitive-engine.service.js'),
  load('autonomous-reasoning-engine.service.js'),
  load('enterprise-knowledge-synthesis.service.js'),
  load('strategic-planning-intelligence.service.js'),
  load('predictive-organizational-intelligence.service.js'),
  load('cross-domain-intelligence-fusion.service.js'),
  load('executive-decision-support.service.js'),
  load('enterprise-cognitive-orchestrator.service.js'),
  load('enterprise-cognitive-dashboard.service.js'),
]);

const cognition = new cognitionM.EnterpriseCognitiveEngineService();
const reasoning = new reasoningM.AutonomousReasoningEngineService();
const knowledge = new knowledgeM.EnterpriseKnowledgeSynthesisService();
const planning = new planningM.StrategicPlanningIntelligenceService();
const prediction = new predictionM.PredictiveOrganizationalIntelligenceService();
const fusion = new fusionM.CrossDomainIntelligenceFusionService();
const executive = new executiveM.ExecutiveDecisionSupportService();

const orchestrator = new orchestratorM.EnterpriseCognitiveOrchestratorService(
  cognition,
  reasoning,
  knowledge,
  planning,
  prediction,
  fusion,
  executive,
);

const result = orchestrator.run(
  'increase enterprise execution capacity',
  [
    {
      id: 'ops-1',
      domain: 'operations',
      source: 'integration',
      value: 88,
      confidence: 0.95,
      observedAt: new Date().toISOString(),
    },
    {
      id: 'finance-1',
      domain: 'finance',
      source: 'integration',
      value: 81,
      confidence: 0.9,
      observedAt: new Date().toISOString(),
    },
    {
      id: 'workforce-1',
      domain: 'workforce',
      source: 'integration',
      value: 74,
      confidence: 0.85,
      observedAt: new Date().toISOString(),
    },
  ],
  120,
);

if (result.plan.horizonDays !== 120) {
  throw new Error('Strategic planning horizon mismatch');
}
if (result.fusion.domains.length !== 3) {
  throw new Error('Cross-domain fusion did not include all domains');
}
if (!result.executiveBrief.decision) {
  throw new Error('Executive decision brief is empty');
}

const dashboard = new dashboardM.EnterpriseCognitiveDashboardService();
const snapshot = dashboard.snapshot(
  84,
  result.reasoning.confidence,
  result.prediction.organizationalReadiness,
  result.fusion.domains.length,
);

if (Object.keys(snapshot.capabilityStatus).length !== 9) {
  throw new Error('Cognitive dashboard capability count mismatch');
}

console.log(JSON.stringify({
  success: true,
  test: 'Ultra Bundle D compiled integration test',
  planId: result.plan.id,
  horizonDays: result.plan.horizonDays,
  domains: result.fusion.domains.length,
  capabilityCount: Object.keys(snapshot.capabilityStatus).length,
  decisionConfidence: result.executiveBrief.confidence,
}, null, 2));