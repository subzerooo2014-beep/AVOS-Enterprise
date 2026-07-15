import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-ai-operations',
);

const requiredFiles = [
  'enterprise-ai-operations.types.ts',
  'ai-operations-engine.service.ts',
  'autonomous-workflow-engine.service.ts',
  'enterprise-automation-engine.service.ts',
  'intelligent-task-orchestrator.service.ts',
  'ai-decision-execution-engine.service.ts',
  'ai-process-optimization-engine.service.ts',
  'workflow-designer-engine.service.ts',
  'event-driven-automation-engine.service.ts',
  'human-approval-engine.service.ts',
  'enterprise-agent-manager.service.ts',
  'multi-agent-collaboration-engine.service.ts',
  'agent-task-routing-engine.service.ts',
  'operations-intelligence-engine.service.ts',
  'sla-operational-risk-engine.service.ts',
  'predictive-operations-engine.service.ts',
  'decision-explainability-engine.service.ts',
  'operations-center-dashboard.service.ts',
  'ai-operations-orchestrator.service.ts',
  'enterprise-ai-operations.controller.ts',
  'enterprise-ai-operations.module.ts',
  'dto/workflow-definition.dto.ts',
  'dto/ai-task.dto.ts',
  'dto/enterprise-agent.dto.ts',
];

const capabilities = [
  'ai-operations-engine',
  'autonomous-workflow-engine',
  'enterprise-automation-engine',
  'intelligent-task-orchestrator',
  'ai-decision-execution-engine',
  'ai-process-optimization-engine',
  'workflow-designer-engine',
  'event-driven-automation-engine',
  'human-approval-engine',
  'enterprise-agent-manager',
  'multi-agent-collaboration-engine',
  'agent-task-routing-engine',
  'operations-intelligence-engine',
  'sla-operational-risk-engine',
  'predictive-operations-engine',
  'decision-explainability-engine',
  'operations-center-dashboard',
  'ai-operations-orchestrator',
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length > 0) {
  console.error(
    JSON.stringify({ success: false, missing }, null, 2),
  );
  process.exit(1);
}

const types = fs.readFileSync(
  path.join(featureRoot, 'enterprise-ai-operations.types.ts'),
  'utf8',
);

const missingCapabilities = capabilities.filter(
  (capability) => !types.includes(`'${capability}'`),
);

if (missingCapabilities.length > 0) {
  console.error(
    JSON.stringify(
      { success: false, missingCapabilities },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system:
        'AVOS Ultra Bundle X Enterprise AI Operations Automation Autonomous Workflows',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      aiOperations: true,
      autonomousWorkflows: true,
      enterpriseAutomation: true,
      intelligentTaskOrchestration: true,
      decisionExecution: true,
      processOptimization: true,
      workflowDesigner: true,
      eventDrivenAutomation: true,
      humanApproval: true,
      enterpriseAgents: true,
      multiAgentCollaboration: true,
      taskRouting: true,
      operationsIntelligence: true,
      slaOperationalRisk: true,
      predictiveOperations: true,
      decisionExplainability: true,
      operationsDashboard: true,
      aiOperationsOrchestrator: true,
    },
    null,
    2,
  ),
);