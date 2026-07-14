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
  strategyM,
  objectiveM,
  portfolioM,
  riskM,
  kpiM,
  simulationM,
  governanceM,
  auditM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('autonomous-strategy-engine.service.js'),
  load('enterprise-objective-management.service.js'),
  load('portfolio-governance-engine.service.js'),
  load('strategic-risk-intelligence.service.js'),
  load('enterprise-kpi-intelligence.service.js'),
  load('strategy-simulation-engine.service.js'),
  load('executive-governance-center.service.js'),
  load('enterprise-decision-audit.service.js'),
  load('enterprise-strategic-governance-orchestrator.service.js'),
  load('strategic-intelligence-dashboard.service.js'),
]);

const strategy = new strategyM.AutonomousStrategyEngineService();
const objectives = new objectiveM.EnterpriseObjectiveManagementService();
const portfolio = new portfolioM.PortfolioGovernanceEngineService();
const risk = new riskM.StrategicRiskIntelligenceService();
const kpi = new kpiM.EnterpriseKpiIntelligenceService();
const simulation = new simulationM.StrategySimulationEngineService();
const governance = new governanceM.ExecutiveGovernanceCenterService();
const audit = new auditM.EnterpriseDecisionAuditService();

const orchestrator =
  new orchestratorM.EnterpriseStrategicGovernanceOrchestratorService(
    strategy,
    objectives,
    portfolio,
    risk,
    kpi,
    simulation,
    governance,
    audit,
  );

const result = orchestrator.run({
  strategyName: 'enterprise expansion',
  objectives: [
    {
      id: 'objective-1',
      title: 'Expand enterprise market',
      owner: 'strategy',
      priority: 95,
      targetValue: 100,
      currentValue: 84,
      dueDate: new Date().toISOString(),
      status: 'active',
    },
    {
      id: 'objective-2',
      title: 'Increase operating efficiency',
      owner: 'operations',
      priority: 85,
      targetValue: 100,
      currentValue: 78,
      dueDate: new Date().toISOString(),
      status: 'active',
    },
  ],
  initiatives: [
    {
      id: 'initiative-1',
      name: 'Enterprise expansion program',
      strategicFit: 92,
      expectedValue: 500,
      cost: 200,
      riskScore: 25,
      dependencies: [],
    },
  ],
  risks: [
    {
      id: 'risk-1',
      category: 'execution',
      probability: 0.4,
      impact: 80,
      mitigation: 'phased rollout',
    },
  ],
  kpis: [
    {
      id: 'kpi-1',
      name: 'Strategic execution rate',
      target: 100,
      actual: 82,
      weight: 1,
    },
  ],
  scenarios: [
    {
      id: 'scenario-1',
      name: 'Balanced growth',
      assumptions: {
        demandGrowth: 15,
        efficiencyGain: 10,
      },
      expectedValue: 80,
      riskScore: 20,
      confidence: 0.9,
    },
  ],
  constraints: ['preserve governance controls'],
});

if (!result.decision.id) {
  throw new Error('Governance decision was not created');
}

if (!result.audit.id) {
  throw new Error('Decision audit record was not created');
}

if (!result.simulation.recommendedScenario) {
  throw new Error('No strategy scenario was recommended');
}

const dashboard = new dashboardM.StrategicIntelligenceDashboardService();
const snapshot = dashboard.snapshot({
  strategyScore: result.strategy.score,
  objectiveCompletion: result.objectiveCompletion,
  portfolioValue: result.rankedPortfolio[0]?.expectedValue ?? 0,
  riskExposure: result.risk.totalExposure,
  kpiHealth: result.kpi.health,
});

if (Object.keys(snapshot.capabilityStatus).length !== 10) {
  throw new Error('Strategic dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle F compiled integration test',
      strategyScore: result.strategy.score,
      objectiveCompletion: result.objectiveCompletion,
      decision: result.decision.outcome,
      auditId: result.audit.id,
      recommendedScenario: result.simulation.recommendedScenario.id,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);