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

const workflowM = await load('autonomous-workflow-engine.service.js');
const routingM = await load('agent-task-routing-engine.service.js');
const decisionsM = await load('ai-decision-execution-engine.service.js');

const workflow = new workflowM.AutonomousWorkflowEngineService();
const execution = workflow.execute({
  id: 'workflow-x-1',
  name: 'Vehicle approval workflow',
  version: 1,
  status: 'active',
  triggers: ['vehicle-submitted'],
  steps: [
    {
      id: 'step-1',
      name: 'Validate',
      type: 'task',
      dependsOn: [],
      timeoutSeconds: 60,
    },
    {
      id: 'step-2',
      name: 'Approve',
      type: 'approval',
      dependsOn: ['step-1'],
      timeoutSeconds: 120,
    },
  ],
});

if (execution.status !== 'completed') {
  throw new Error('Workflow smoke test failed');
}

const routing = new routingM.AgentTaskRoutingEngineService();
const route = routing.route(
  {
    id: 'task-x-1',
    type: 'vehicle-validation',
    priority: 10,
    requiredCapabilities: ['vehicle-validation'],
    status: 'queued',
  },
  [
    {
      id: 'agent-x-1',
      name: 'Validation Agent',
      capabilities: ['vehicle-validation'],
      active: true,
      currentLoad: 1,
      successRate: 0.98,
    },
  ],
);

if (!route.routed) {
  throw new Error('Agent routing smoke test failed');
}

const decisions = new decisionsM.AiDecisionExecutionEngineService();
const decision = decisions.execute({
  id: 'decision-x-1',
  decisionType: 'approval',
  recommendation: 'approve',
  confidence: 0.92,
  approved: true,
  explanation: ['policy-compliant'],
});

if (!decision.executed) {
  throw new Error('Decision execution smoke test failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle X compiled smoke test',
      workflowStatus: execution.status,
      routedAgent: route.agentId,
      decisionExecuted: decision.executed,
    },
    null,
    2,
  ),
);