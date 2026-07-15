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
  customer360M,
  healthM,
  churnM,
  retentionM,
  feedbackM,
  orchestratorM,
  revenueM,
  dashboardM,
] = await Promise.all([
  load('customer-360-engine.service.js'),
  load('customer-health-score-engine.service.js'),
  load('churn-prediction-engine.service.js'),
  load('customer-retention-ai.service.js'),
  load('customer-feedback-nps-engine.service.js'),
  load('customer-success-orchestrator.service.js'),
  load('revenue-growth-intelligence.service.js'),
  load('executive-crm-dashboard.service.js'),
]);

const customer360 = new customer360M.Customer360EngineService();
const health = new healthM.CustomerHealthScoreEngineService();
const churn = new churnM.ChurnPredictionEngineService();
const retention = new retentionM.CustomerRetentionAiService();
const feedback = new feedbackM.CustomerFeedbackNpsEngineService();

const orchestrator =
  new orchestratorM.CustomerSuccessOrchestratorService(
    customer360,
    health,
    churn,
    retention,
    feedback,
  );

const customer = {
  id: 'customer-w-1',
  name: 'VIP Customer',
  email: 'vip@example.com',
  segment: 'premium',
  lifetimeValue: 180000,
  engagementScore: 88,
  satisfactionScore: 92,
  lastActivityAt: new Date().toISOString(),
};

const opportunities = [
  {
    id: 'opportunity-w-1',
    customerId: customer.id,
    title: 'Premium vehicle purchase',
    value: 600000,
    probability: 0.75,
    stage: 'negotiation',
  },
];

const result = orchestrator.run({
  customer,
  interactions: [
    {
      id: 'interaction-w-1',
      customerId: customer.id,
      channel: 'chat',
      direction: 'inbound',
      subject: 'Vehicle inquiry',
      occurredAt: new Date().toISOString(),
      sentiment: 0.9,
    },
  ],
  opportunities,
  feedback: [
    {
      id: 'feedback-w-1',
      customerId: customer.id,
      score: 10,
      createdAt: new Date().toISOString(),
    },
  ],
});

if (result.health.status !== 'healthy') {
  throw new Error('Customer success orchestration failed');
}

const revenue = new revenueM.RevenueGrowthIntelligenceService();
const revenueResult = revenue.analyze(opportunities, [
  {
    campaignId: 'campaign-w-1',
    audience: 1000,
    delivered: 950,
    opened: 500,
    clicked: 200,
    converted: 30,
    revenue: 300000,
  },
]);

const dashboard = new dashboardM.ExecutiveCrmDashboardService();
const snapshot = dashboard.snapshot({
  activeCustomers: 1,
  healthyCustomers: 1,
  qualifiedLeads: 1,
  pipelineValue: revenueResult.weightedPipeline,
  churnRisk: result.churn.risk,
  nps: result.feedback.nps,
});

if (Object.keys(snapshot.capabilityStatus).length !== 18) {
  throw new Error('CRM capability count mismatch');
}

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'Ultra Bundle W compiled integration test',
      customerHealth: result.health.healthScore,
      churnRisk: result.churn.risk,
      nps: result.feedback.nps,
      projectedRevenue: revenueResult.projectedRevenue,
      capabilityCount: Object.keys(snapshot.capabilityStatus).length,
    },
    null,
    2,
  ),
);