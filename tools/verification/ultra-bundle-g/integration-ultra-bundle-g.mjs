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
  valueM,
  performanceM,
  bottleneckM,
  resourceM,
  costM,
  revenueM,
  profitabilityM,
  roiM,
  forecastM,
  orchestratorM,
  dashboardM,
] = await Promise.all([
  load('enterprise-value-intelligence-engine.service.js'),
  load('business-performance-intelligence.service.js'),
  load('enterprise-bottleneck-analyzer.service.js'),
  load('resource-efficiency-optimizer.service.js'),
  load('enterprise-cost-intelligence.service.js'),
  load('revenue-intelligence-engine.service.js'),
  load('profitability-intelligence.service.js'),
  load('enterprise-roi-intelligence.service.js'),
  load('enterprise-value-forecast-engine.service.js'),
  load('enterprise-value-optimization-orchestrator.service.js'),
  load('enterprise-optimization-dashboard.service.js'),
]);

const value = new valueM.EnterpriseValueIntelligenceEngineService();
const performance = new performanceM.BusinessPerformanceIntelligenceService();
const bottlenecks = new bottleneckM.EnterpriseBottleneckAnalyzerService();
const resources = new resourceM.ResourceEfficiencyOptimizerService();
const costs = new costM.EnterpriseCostIntelligenceService();
const revenue = new revenueM.RevenueIntelligenceEngineService();
const profitability = new profitabilityM.ProfitabilityIntelligenceService();
const roi = new roiM.EnterpriseRoiIntelligenceService();
const forecast = new forecastM.EnterpriseValueForecastEngineService();

const orchestrator =
  new orchestratorM.EnterpriseValueOptimizationOrchestratorService(
    value,
    performance,
    bottlenecks,
    resources,
    costs,
    revenue,
    profitability,
    roi,
    forecast,
  );

const result = orchestrator.run({
  costs: [
    {
      id: 'cost-1',
      category: 'operations',
      amount: 500,
      avoidablePercent: 12,
    },
    {
      id: 'cost-2',
      category: 'technology',
      amount: 300,
      avoidablePercent: 8,
    },
  ],
  revenues: [
    {
      id: 'revenue-1',
      stream: 'subscriptions',
      amount: 1600,
      growthRate: 10,
      marginPercent: 65,
    },
    {
      id: 'revenue-2',
      stream: 'transactions',
      amount: 900,
      growthRate: 6,
      marginPercent: 45,
    },
  ],
  metrics: [
    {
      id: 'metric-1',
      name: 'Execution rate',
      actual: 86,
      target: 100,
      weight: 2,
      unit: 'percent',
    },
    {
      id: 'metric-2',
      name: 'Customer retention',
      actual: 78,
      target: 90,
      weight: 1,
      unit: 'percent',
    },
  ],
  resources: [
    {
      id: 'resource-1',
      resource: 'compute',
      capacity: 100,
      used: 72,
      cost: 400,
    },
    {
      id: 'resource-2',
      resource: 'workforce',
      capacity: 80,
      used: 64,
      cost: 600,
    },
  ],
  stages: [
    {
      id: 'stage-1',
      name: 'Qualification',
      throughput: 80,
      waitTime: 20,
      errorRate: 5,
    },
    {
      id: 'stage-2',
      name: 'Approval',
      throughput: 55,
      waitTime: 65,
      errorRate: 12,
    },
  ],
});

if (result.value.grossValue <= 0) {
  throw new Error('Enterprise value result is invalid');
}

if (result.profitability.profit <= 0) {
  throw new Error('Profitability result is invalid');
}

if (result.forecast.projectedValue <= result.forecast.currentValue) {
  throw new Error('Value forecast did not project growth');
}

const dashboard = new dashboardM.EnterpriseOptimizationDashboardService();
const snapshot = dashboard.snapshot({
  enterpriseValueScore: result.value.valueScore,
  performanceScore: result.performance.score,
  costEfficiency: 100 - Math.min(100, result.costs.avoidableCost / 10),
  profitabilityScore: result.profitability.profitabilityScore,
  roiScore: result.roi.roiScore,
  optimizationOpportunityValue:
    result.costs.avoidableCost + result.resources.totalAvoidableCost,
});

if (Object.keys(snapshot.capabilityStatus).length !== 12) {
  throw new Error('Optimization dashboard capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle G compiled integration test',
      grossValue: result.value.grossValue,
      performanceScore: result.performance.score,
      profitability: result.profitability.profit,
      roiPercent: result.roi.roiPercent,
      projectedValue: result.forecast.projectedValue,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);