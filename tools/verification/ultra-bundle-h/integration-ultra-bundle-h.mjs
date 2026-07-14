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
  resilienceM,
  riskM,
  dependencyM,
  failureM,
  policyM,
  continuityM,
  crisisM,
  commandM,
  orchestratorM,
  dashboardM,
  disasterM,
  simulationM,
] = await Promise.all([
  load('enterprise-resilience-engine.service.js'),
  load('operational-risk-intelligence.service.js'),
  load('critical-dependency-mapper.service.js'),
  load('failure-prediction-engine.service.js'),
  load('continuity-policy-engine.service.js'),
  load('business-continuity-orchestrator.service.js'),
  load('autonomous-crisis-response.service.js'),
  load('executive-crisis-command-center.service.js'),
  load('enterprise-resilience-continuity-orchestrator.service.js'),
  load('resilience-continuity-dashboard.service.js'),
  load('disaster-recovery-intelligence.service.js'),
  load('resilience-simulation-laboratory.service.js'),
]);

const resilience = new resilienceM.EnterpriseResilienceEngineService();
const risk = new riskM.OperationalRiskIntelligenceService();
const dependencies = new dependencyM.CriticalDependencyMapperService();
const failure = new failureM.FailurePredictionEngineService();
const policy = new policyM.ContinuityPolicyEngineService();
const continuity = new continuityM.BusinessContinuityOrchestratorService();
const crisis = new crisisM.AutonomousCrisisResponseService();
const commandCenter = new commandM.ExecutiveCrisisCommandCenterService();

const orchestrator =
  new orchestratorM.EnterpriseResilienceContinuityOrchestratorService(
    resilience,
    risk,
    dependencies,
    failure,
    policy,
    continuity,
    crisis,
    commandCenter,
  );

const dependencyRecords = [
  {
    id: 'database',
    name: 'Primary Database',
    domain: 'data',
    criticality: 95,
    recoveryTimeObjectiveMinutes: 45,
    recoveryPointObjectiveMinutes: 10,
    dependencies: ['storage'],
  },
  {
    id: 'storage',
    name: 'Object Storage',
    domain: 'data',
    criticality: 85,
    recoveryTimeObjectiveMinutes: 60,
    recoveryPointObjectiveMinutes: 15,
    dependencies: [],
  },
];

const result = orchestrator.run({
  signals: [
    {
      id: 'api-signal',
      domain: 'api',
      health: 88,
      redundancy: 82,
      recoveryReadiness: 80,
      observedAt: new Date().toISOString(),
    },
    {
      id: 'data-signal',
      domain: 'data',
      health: 74,
      redundancy: 90,
      recoveryReadiness: 78,
      observedAt: new Date().toISOString(),
    },
  ],
  risks: [
    {
      id: 'risk-data',
      domain: 'data',
      probability: 0.45,
      impact: 90,
      detectability: 75,
      mitigation: 'multi-region replication',
    },
  ],
  dependencies: dependencyRecords,
  policies: [
    {
      id: 'policy-1',
      name: 'Critical continuity policy',
      minimumHealth: 70,
      maximumRecoveryTimeMinutes: 90,
      requiresExecutiveApproval: false,
    },
  ],
  incident: {
    id: 'incident-1',
    title: 'Data layer disruption',
    domain: 'data',
    severity: 'high',
    status: 'detected',
    detectedAt: new Date().toISOString(),
    affectedDependencies: ['database', 'storage'],
  },
});

if (!result.recoveryPlan.actions.length) {
  throw new Error('Recovery plan was not created');
}

if (!result.registeredIncident.id) {
  throw new Error('Incident was not registered');
}

const disaster = new disasterM.DisasterRecoveryIntelligenceService();
const disasterResult = disaster.assess(dependencyRecords);

if (disasterResult.overallReadiness <= 0) {
  throw new Error('Disaster recovery readiness is invalid');
}

const simulation =
  new simulationM.ResilienceSimulationLaboratoryService();
const simulationResult = simulation.simulate(
  [
    {
      id: 'scenario-1',
      name: 'Database outage',
      failedDependencies: ['database'],
      trafficMultiplier: 1.5,
      dataLossMinutes: 10,
    },
  ],
  dependencyRecords,
);

if (simulationResult.results.length !== 1) {
  throw new Error('Resilience simulation failed');
}

const dashboard = new dashboardM.ResilienceContinuityDashboardService();
const snapshot = dashboard.snapshot({
  resilienceScore: result.resilience.resilienceScore,
  riskExposure: result.risk.totalExposure,
  continuityReadiness: disasterResult.overallReadiness,
  activeIncidents: result.commandCenter.active,
  recoveryCapacity: 82,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Resilience dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle H compiled integration test',
      resilienceScore: result.resilience.resilienceScore,
      riskExposure: result.risk.totalExposure,
      recoveryActions: result.recoveryPlan.actions.length,
      incidentStatus: result.registeredIncident.status,
      disasterReadiness: disasterResult.overallReadiness,
      simulationSurvivable: simulationResult.results[0].survivable,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);