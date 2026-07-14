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
  synthesisM,
  planningM,
  explainabilityM,
  orchestratorM,
  memoryM,
  longMemoryM,
  agentsM,
  goalsM,
  learningM,
  analyticsM,
  dashboardM,
] = await Promise.all([
  load('enterprise-cognitive-engine.service.js'),
  load('autonomous-reasoning-engine.service.js'),
  load('knowledge-synthesis-engine.service.js'),
  load('strategic-planning-intelligence.service.js'),
  load('decision-explainability-engine.service.js'),
  load('cognitive-workflow-orchestrator.service.js'),
  load('enterprise-memory-graph-v2.service.js'),
  load('long-term-enterprise-memory.service.js'),
  load('multi-agent-collaboration-core.service.js'),
  load('autonomous-goal-management.service.js'),
  load('enterprise-learning-engine.service.js'),
  load('cognitive-analytics-center.service.js'),
  load('enterprise-cognitive-dashboard.service.js'),
]);

const cognition = new cognitionM.EnterpriseCognitiveEngineService();
const reasoning = new reasoningM.AutonomousReasoningEngineService();
const synthesis = new synthesisM.KnowledgeSynthesisEngineService();
const planning = new planningM.StrategicPlanningIntelligenceService();
const explainability =
  new explainabilityM.DecisionExplainabilityEngineService();

const orchestrator = new orchestratorM.CognitiveWorkflowOrchestratorService(
  cognition,
  reasoning,
  synthesis,
  planning,
  explainability,
);

const signals = [
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
    id: 'risk-1',
    domain: 'risk',
    source: 'integration',
    value: 76,
    confidence: 0.85,
    observedAt: new Date().toISOString(),
  },
];

const result = orchestrator.run(
  'increase enterprise intelligence quality',
  signals,
  120,
);

if (!result.plan.id) {
  throw new Error('Strategic plan was not created');
}

if (!result.explanation.reasoningSteps.length) {
  throw new Error('Decision explanation was not created');
}

const memory = new memoryM.EnterpriseMemoryGraphV2Service();
const graph = memory.build(
  [
    {
      id: 'operations',
      type: 'domain',
      label: 'Operations',
      importance: 90,
      lastAccessedAt: new Date().toISOString(),
      attributes: {},
    },
    {
      id: 'finance',
      type: 'domain',
      label: 'Finance',
      importance: 85,
      lastAccessedAt: new Date().toISOString(),
      attributes: {},
    },
  ],
  [
    {
      id: 'edge-1',
      from: 'operations',
      to: 'finance',
      relation: 'influences',
      weight: 0.8,
    },
  ],
);

const longMemory = new longMemoryM.LongTermEnterpriseMemoryService();
longMemory.store({
  id: 'memory-1',
  type: 'decision',
  label: 'Enterprise cognitive decision',
  importance: 95,
  lastAccessedAt: new Date().toISOString(),
  attributes: { approved: true },
});

if (longMemory.recall(90).length !== 1) {
  throw new Error('Long-term enterprise memory failed');
}

const agents = new agentsM.MultiAgentCollaborationCoreService();
const consensus = agents.aggregate([
  {
    agentId: 'strategy-agent',
    role: 'strategy',
    recommendation: 'optimize',
    confidence: 0.88,
    rationale: ['high value'],
  },
  {
    agentId: 'risk-agent',
    role: 'risk',
    recommendation: 'optimize',
    confidence: 0.82,
    rationale: ['acceptable risk'],
  },
]);

if (consensus.consensus?.recommendation !== 'optimize') {
  throw new Error('Multi-agent collaboration failed');
}

const goals = new goalsM.AutonomousGoalManagementService();
const goalResult = goals.evaluate([
  {
    id: 'goal-1',
    title: 'Improve cognition',
    owner: 'enterprise-ai',
    priority: 95,
    targetValue: 100,
    currentValue: 78,
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    dependencies: [],
  },
]);

const learning = new learningM.EnterpriseLearningEngineService();
const learningResult = learning.learn([
  {
    id: 'observation-1',
    context: 'cognitive-cycle',
    expectedOutcome: 75,
    actualOutcome: 84,
    confidence: 0.9,
    observedAt: new Date().toISOString(),
  },
]);

const analytics = new analyticsM.CognitiveAnalyticsCenterService();
const analyticsResult = analytics.analyze(
  signals,
  result.hypotheses,
);

const dashboard = new dashboardM.EnterpriseCognitiveDashboardService();
const snapshot = dashboard.snapshot({
  cognitionScore:
    result.hypotheses.reduce((sum, hypothesis) => sum + hypothesis.score, 0) /
    Math.max(1, result.hypotheses.length),
  reasoningConfidence: result.reasoning.confidence,
  knowledgeCoverage: result.knowledge.knowledgeCoverage,
  memoryHealth: graph.graphHealth,
  learningVelocity: learningResult.learningVelocity,
  activeGoals: goalResult.length,
});

if (Object.keys(snapshot.capabilityStatus).length !== 13) {
  throw new Error('Cognitive dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle N compiled integration test',
      reasoningConfidence: result.reasoning.confidence,
      knowledgeCoverage: result.knowledge.knowledgeCoverage,
      graphHealth: graph.graphHealth,
      consensus: consensus.consensus.recommendation,
      learningVelocity: learningResult.learningVelocity,
      analyticsDomains: analyticsResult.domainCount,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);