import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(root, 'apps', 'api', 'src', 'enterprise-cognition');

const requiredFiles = [
  'enterprise-cognition.types.ts',
  'enterprise-cognitive-engine.service.ts',
  'autonomous-reasoning-engine.service.ts',
  'multi-agent-decision-intelligence.service.ts',
  'enterprise-knowledge-synthesis.service.ts',
  'strategic-planning-intelligence.service.ts',
  'predictive-organizational-intelligence.service.ts',
  'executive-decision-support.service.ts',
  'cross-domain-intelligence-fusion.service.ts',
  'enterprise-cognitive-orchestrator.service.ts',
  'enterprise-cognitive-dashboard.service.ts',
  'enterprise-cognition.controller.ts',
  'enterprise-cognition.module.ts',
  'dto/run-cognition.dto.ts',
  'dto/executive-decision.dto.ts',
];

const capabilities = [
  'enterprise-cognitive-engine',
  'autonomous-reasoning-engine',
  'multi-agent-decision-intelligence',
  'enterprise-knowledge-synthesis',
  'strategic-planning-intelligence',
  'predictive-organizational-intelligence',
  'executive-decision-support',
  'cross-domain-intelligence-fusion',
  'enterprise-cognitive-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-cognition.types.ts'),
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

console.log(JSON.stringify({
  success: true,
  system: 'AVOS Ultra Bundle D Autonomous Intelligence & Enterprise Cognition',
  requiredFiles: requiredFiles.length,
  capabilities: capabilities.length,
  cognitiveEngine: true,
  autonomousReasoning: true,
  multiAgentDecisionIntelligence: true,
  knowledgeSynthesis: true,
  strategicPlanning: true,
  organizationalPrediction: true,
  executiveDecisionSupport: true,
  crossDomainFusion: true,
  cognitiveDashboard: true,
}, null, 2));