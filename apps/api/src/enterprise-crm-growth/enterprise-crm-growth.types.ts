export const ENTERPRISE_CRM_GROWTH_CAPABILITIES = [
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
] as const;

export type EnterpriseCrmGrowthCapability =
  (typeof ENTERPRISE_CRM_GROWTH_CAPABILITIES)[number];

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  segment: string;
  lifetimeValue: number;
  engagementScore: number;
  satisfactionScore: number;
  lastActivityAt: string;
}

export interface Lead {
  id: string;
  customerId?: string;
  source: string;
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'lost';
}

export interface Opportunity {
  id: string;
  customerId: string;
  title: string;
  value: number;
  probability: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
}

export interface CustomerInteraction {
  id: string;
  customerId: string;
  channel: 'email' | 'sms' | 'phone' | 'chat' | 'push';
  direction: 'inbound' | 'outbound';
  subject: string;
  occurredAt: string;
  sentiment: number;
}

export interface LoyaltyAccount {
  customerId: string;
  points: number;
  tier: 'basic' | 'silver' | 'gold' | 'platinum';
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface CampaignMetric {
  campaignId: string;
  audience: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}

export interface CrmGrowthDashboardSnapshot {
  generatedAt: string;
  activeCustomers: number;
  healthyCustomers: number;
  qualifiedLeads: number;
  pipelineValue: number;
  churnRisk: number;
  nps: number;
  capabilityStatus: Record<
    EnterpriseCrmGrowthCapability,
    'operational'
  >;
}