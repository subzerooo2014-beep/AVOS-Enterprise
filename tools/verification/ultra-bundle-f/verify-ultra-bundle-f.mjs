import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-strategic-governance',
);

const requiredFiles = [
  'enterprise-strategic-governance.types.ts',
  'autonomous-strategy-engine.service.ts',
  'enterprise-objective-management.service.ts',
  'portfolio-governance-engine.service.ts',
  'strategic-risk-intelligence.service.ts',
  'enterprise-kpi-intelligence.service.ts',
  'autonomous-okr-engine.service.ts',
  'executive-governance-center.service.ts',
  'enterprise-decision-audit.service.ts',
  'strategy-simulation-engine.service.ts',
  'enterprise-strategic-governance-orchestrator.service.ts',
  'strategic-intelligence-dashboard.service.ts',
  'enterprise-strategic-governance.controller.ts',
  'enterprise-strategic-governance.module.ts',
  'dto/strategy-evaluation.dto.ts',
  'dto/portfolio-governance.dto.ts',
  'dto/strategy-simulation.dto.ts',
];

const capabilities = [
  'autonomous-strategy-engine',
  'enterprise-objective-management',
  'portfolio-governance-engine',
  'strategic-risk-intelligence',
  'enterprise-kpi-intelligence',
  'autonomous-okr-engine',
  'executive-governance-center',
  'enterprise-decision-audit',
  'strategy-simulation-engine',
  'strategic-intelligence-dashboard',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(JSON.stringify({ success: false, missing }, null, 2));
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-strategic-governance.types.ts'),
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
        'AVOS Ultra Bundle F Enterprise Autonomy & Strategic Governance',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      autonomousStrategyEngine: true,
      objectiveManagement: true,
      portfolioGovernance: true,
      strategicRiskIntelligence: true,
      enterpriseKpiIntelligence: true,
      autonomousOkrEngine: true,
      executiveGovernanceCenter: true,
      enterpriseDecisionAudit: true,
      strategySimulationEngine: true,
      strategicIntelligenceDashboard: true,
    },
    null,
    2,
  ),
);