export type SubscriptionBillingStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface SubscriptionBillingCapability {
  id: string;
  name: string;
  group: string;
  status: SubscriptionBillingStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}