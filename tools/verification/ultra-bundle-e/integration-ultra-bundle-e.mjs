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

      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.name === name) {
        return full;
      }
    }
  }

  throw new Error(`Compiled file not found: ${name}`);
}

async function load(name) {
  return import(pathToFileURL(findFile(name)));
}

const [
  planningM,
  allocationM,
  policyM,
  controlM,
  orchestratorM,
  commandM,
  dashboardM,
  coordinationM,
  recoveryM,
] = await Promise.all([
  load('mission-planning-engine.service.js'),
  load('adaptive-resource-allocation.service.js'),
  load('enterprise-execution-policy-engine.service.js'),
  load('real-time-operational-control.service.js'),
  load('autonomous-execution-orchestrator.service.js'),
  load('enterprise-command-center.service.js'),
  load('autonomous-operations-dashboard.service.js'),
  load('cross-functional-coordination-mesh.service.js'),
  load('autonomous-workflow-recovery.service.js'),
]);

const planning = new planningM.MissionPlanningEngineService();
const allocation = new allocationM.AdaptiveResourceAllocationService();
const policy = new policyM.EnterpriseExecutionPolicyEngineService();
const control = new controlM.RealTimeOperationalControlService();

const orchestrator = new orchestratorM.AutonomousExecutionOrchestratorService(
  planning,
  allocation,
  policy,
  control,
);

const result = orchestrator.execute(
  {
    id: 'mission-integration',
    objective: 'coordinate enterprise-wide launch',
    owner: 'enterprise-operations',
    priority: 95,
    requiredCapabilities: ['planning', 'coordination', 'execution'],
    dependencies: ['finance-ready'],
    status: 'planned',
  },
  [
    {
      name: 'compute',
      available: 100,
      committed: 10,
      unit: 'capacity',
    },
    {
      name: 'workforce',
      available: 80,
      committed: 20,
      unit: 'capacity',
    },
  ],
  [
    {
      id: 'policy-1',
      name: 'Autonomous execution policy',
      maxRiskScore: 100,
      requiresApproval: false,
      allowedActions: ['planning', 'coordination', 'execution'],
    },
  ],
);

if (!result.approved) {
  throw new Error(`Execution was not approved: ${result.blockers.join(',')}`);
}

if (result.status !== 'running') {
  throw new Error(`Unexpected mission status: ${result.status}`);
}

const commandCenter = new commandM.EnterpriseCommandCenterService();
commandCenter.register(result);

const dashboard = new dashboardM.AutonomousOperationsDashboardService(
  commandCenter,
);
const snapshot = dashboard.snapshot(result.readinessScore, 140);

if (Object.keys(snapshot.capabilityStatus).length !== 10) {
  throw new Error('Dashboard capability count mismatch');
}

const coordination =
  new coordinationM.CrossFunctionalCoordinationMeshService();
const mesh = coordination.coordinate(
  ['operations', 'finance', 'workforce'],
  result.missionId,
);

if (mesh.connectedDomains !== 3 || mesh.channels.length !== 3) {
  throw new Error('Cross-functional coordination mesh failed');
}

const recovery = new recoveryM.AutonomousWorkflowRecoveryService();
const recoveryResult = recovery.recover(result.missionId, ['sync-step']);

if (!recoveryResult.recoverable) {
  throw new Error('Workflow recovery integration failed');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle E compiled integration test',
      missionId: result.missionId,
      status: result.status,
      readinessScore: result.readinessScore,
      connectedDomains: mesh.connectedDomains,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
      recoveryActions: recoveryResult.recoveryActions.length,
    },
    null,
    2,
  ),
);