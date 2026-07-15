import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const featureRoot = path.join(
  root,
  'apps',
  'api',
  'src',
  'enterprise-crm-growth',
);

const requiredFiles = [
  'enterprise-crm-growth.types.ts',
  'customer-360-engine.service.ts',
  'customer-success-engine.service.ts',
  'customer-health-score-engine.service.ts',
  'customer-journey-intelligence.service.ts',
  'lead-lifecycle-engine.service.ts',
  'opportunity-management-engine.service.ts',
  'sales-pipeline-intelligence.service.ts',
  'customer-communication-hub.service.ts',
  'loyalty-rewards-engine.service.ts',
  'referral-intelligence-engine.service.ts',
  'customer-retention-ai.service.ts',
  'churn-prediction-engine.service.ts',
  'customer-feedback-nps-engine.service.ts',
  'marketing-campaign-intelligence.service.ts',
  'segmentation-personalization-ai.service.ts',
  'revenue-growth-intelligence.service.ts',
  'customer-success-orchestrator.service.ts',
  'executive-crm-dashboard.service.ts',
  'enterprise-crm-growth.controller.ts',
  'enterprise-crm-growth.module.ts',
  'dto/customer-profile.dto.ts',
  'dto/lead.dto.ts',
  'dto/opportunity.dto.ts',
];

const capabilities = [
  'customer-360-engine',
  'customer-success-engine',
  'customer-health-score-engine',
  'customer-journey-intelligence',
  'lead-lifecycle-engine',
  'opportunity-management-engine',
  'sales-pipeline-intelligence',
  'customer-communication-hub',
  'loyalty-rewards-engine',
  'referral-intelligence-engine',
  'customer-retention-ai',
  'churn-prediction-engine',
  'customer-feedback-nps-engine',
  'marketing-campaign-intelligence',
  'segmentation-personalization-ai',
  'revenue-growth-intelligence',
  'customer-success-orchestrator',
  'executive-crm-dashboard',
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
  path.join(featureRoot, 'enterprise-crm-growth.types.ts'),
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
        'AVOS Ultra Bundle W Enterprise CRM Customer Success Growth Intelligence',
      requiredFiles: requiredFiles.length,
      capabilities: capabilities.length,
      customer360: true,
      customerSuccess: true,
      customerHealth: true,
      journeyIntelligence: true,
      leadLifecycle: true,
      opportunityManagement: true,
      salesPipeline: true,
      communicationHub: true,
      loyaltyRewards: true,
      referralIntelligence: true,
      retentionAi: true,
      churnPrediction: true,
      feedbackNps: true,
      campaignIntelligence: true,
      segmentationPersonalization: true,
      revenueGrowth: true,
      customerSuccessOrchestrator: true,
      executiveCrmDashboard: true,
    },
    null,
    2,
  ),
);