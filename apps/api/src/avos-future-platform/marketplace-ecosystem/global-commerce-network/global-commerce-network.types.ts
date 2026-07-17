export type GlobalCommerceNetworkStatus = 'planned' | 'active' | 'degraded' | 'disabled';

export interface GlobalCommerceNetworkCapability {
  id: string;
  name: string;
  group: string;
  status: GlobalCommerceNetworkStatus;
  version: string;
  dependencies: string[];
  policies: string[];
  metrics: Record<string, number>;
  updatedAt: string;
}