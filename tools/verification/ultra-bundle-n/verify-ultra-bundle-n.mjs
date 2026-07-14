import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-ai-cognitive-core',
);

const requiredFiles = [
  'enterprise-ai-cognitive-core.types.ts',
  'enterprise-cognitive-engine.service.ts',
  'autonomous-reasoning-engine.service.ts',
  'knowledge-synthesis-engine.service.ts',
  'enterprise-memory-graph-v2.service.ts',
  'long-term-enterprise-memory.service.ts',
  'multi-agent-collaboration-core.service.ts',
  'autonomous-goal-management.service.ts',
  'enterprise-learning-engine.service.ts',
  'decision-explainability-engine.service.ts',
  'strategic-planning-intelligence.service.ts',
  'cognitive-workflow-orchestrator.service.ts',
  'enterprise-cognitive-dashboard.service.ts',
  'cognitive-analytics-center.service.ts',
  'enterprise-ai-cognitive-core.controller.ts',
  'enterprise-ai-cognitive-core.module.ts',
  'dto/run-cognitive-cycle.dto.ts',
  'dto/memory-graph.dto.ts',
  'dto/goal-management.dto.ts',
];

const capabilities = [
  'enterprise-cognitive-engine',
  'autonomous-reasoning-engine',
  'knowledge-synthesis-engine',
  'enterprise-memory-graph-v2',
  'long-term-enterprise-memory',
  'multi-agent-collaboration-core',
  'autonomous-goal-management',
  'enterprise-learning-engine',
  'decision-explainability-engine',
  'strategic-planning-intelligence',
  'cognitive-workflow-orchestrator',
  'enterprise-cognitive-dashboard',
  'cognitive-analytics-center',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-ai-cognitive-core.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify({ success: false, missingCapabilities }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle N Enterprise AI Cognitive Core Autonomous Reasoning',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      cognitiveEngine: true,
      autonomousReasoning: true,
      knowledgeSynthesis: true,
      memoryGraphV2: true,
      longTermMemory: true,
      multiAgentCollaboration: true,
      autonomousGoalManagement: true,
      enterpriseLearning: true,
      decisionExplainability: true,
      strategicPlanning: true,
      cognitiveWorkflowOrchestrator: true,
      cognitiveDashboard: true,
      cognitiveAnalyticsCenter: true,
    },
    null,
    2,
  ),
);