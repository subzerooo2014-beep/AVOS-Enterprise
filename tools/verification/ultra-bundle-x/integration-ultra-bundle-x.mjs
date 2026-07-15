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
  workflowsM,
  tasksM,
  operationsM,
  optimizationM,
  predictionM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('autonomous-workflow-engine.service.js'),
  load('intelligent-task-orchestrator.service.js'),
  load('ai-operations-engine.service.js'),
  load('ai-process-optimization-engine.service.js'),
  load('predictive-operations-engine.service.js'),
  load('ai-operations-orchestrator.service.js'),
  load('operations-center-dashboard.service.js'),
]);

const workflows = new workflowsM.AutonomousWorkflowEngineService();
const tasks = new tasksM.IntelligentTaskOrchestratorService();
const operations = new operationsM.AiOperationsEngineService();
const optimization = new optimizationM.AiProcessOptimizationEngineService();
const prediction = new predictionM.PredictiveOperationsEngineService();

const orchestrator =
  new orchestratorM.AiOperationsOrchestratorService(
    workflows,
    tasks,
    operations,
    optimization,
    prediction,
  );

const metrics = [
  {
    id: 'metric-x-1',
    process: 'vehicle-listing-approval',
    throughput: 120,
    latencyMs: 450,
    errorRate: 0.01,
    slaTargetMs: 600,
  },
];

const result = orchestrator.run({
  workflow: {
    id: 'workflow-x-1',
    name: 'Vehicle approval',
    version: 1,
    status: 'active',
    triggers: ['vehicle-submitted'],
    steps: [
      {
        id: 'validate',
        name: 'Validate vehicle',
        type: 'agent',
        dependsOn: [],
        timeoutSeconds: 60,
      },
      {
        id: 'approve',
        name: 'Approve vehicle',
        type: 'decision',
        dependsOn: ['validate'],
        timeoutSeconds: 60,
      },
    ],
  },
  tasks: [
    {
      id: 'task-x-1',
      type: 'vehicle-validation',
      priority: 10,
      requiredCapabilities: ['vehicle-validation'],
      status: 'queued',
    },
  ],
  agents: [
    {
      id: 'agent-x-1',
      name: 'Vehicle Validation Agent',
      capabilities: ['vehicle-validation'],
      active: true,
      currentLoad: 1,
      successRate: 0.97,
    },
  ],
  metrics,
});

if (result.workflow.status !== 'completed') {
  throw new Error('AI operations workflow integration failed');
}

if (!result.taskAssignments[0].assigned) {
  throw new Error('AI task assignment integration failed');
}

if (!result.operations.healthy) {
  throw new Error('AI operations health integration failed');
}

const dashboard = new dashboardM.OperationsCenterDashboardService();
const snapshot = dashboard.snapshot({
  activeWorkflows: 1,
  queuedTasks: result.operations.queued,
  activeAgents: 1,
  automationRate: 90,
  slaCompliance: result.operations.slaCompliance,
  decisionExecutionRate: 100,
});

if (Object.keys(snapshot.capabilityStatus).length !== 18) {
  throw new Error('AI operations capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle X compiled integration test',
      workflowStatus: result.workflow.status,
      assignedTasks: result.taskAssignments.filter((item) => item.assigned)
        .length,
      slaCompliance: result.operations.slaCompliance,
      optimizationScore: result.optimization[0].optimizationScore,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);