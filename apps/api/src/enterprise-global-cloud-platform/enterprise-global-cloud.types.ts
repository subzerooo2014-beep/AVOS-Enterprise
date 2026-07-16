export interface CloudRegionRecord {
  id: string;
  name: string;
  provider: string;
  country: string;
  status: "ACTIVE" | "DEGRADED" | "OFFLINE";
  priority: number;
  capabilities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CloudDeploymentRecord {
  id: string;
  application: string;
  version: string;
  regionId: string;
  status: "PLANNED" | "DEPLOYING" | "DEPLOYED" | "FAILED" | "ROLLED_BACK";
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface TrafficRouteRecord {
  id: string;
  service: string;
  regionId: string;
  weight: number;
  enabled: boolean;
  updatedAt: string;
}

export interface GlobalConfigurationRecord {
  id: string;
  namespace: string;
  key: string;
  value: unknown;
  version: number;
  regionOverrides: Record<string, unknown>;
  updatedAt: string;
}

export interface ReleaseChannelRecord {
  id: string;
  name: string;
  version: string;
  audiencePercent: number;
  regions: string[];
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface CloudGovernancePolicyRecord {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Record<string, unknown>;
  effect: "ALLOW" | "DENY" | "REVIEW";
  createdAt: string;
  updatedAt: string;
}

export interface GlobalCloudMetrics {
  regions: number;
  activeRegions: number;
  deployments: number;
  successfulDeployments: number;
  failedDeployments: number;
  routes: number;
  activeRoutes: number;
  configurations: number;
  releaseChannels: number;
  activeReleaseChannels: number;
  governancePolicies: number;
}

export interface GlobalCloudHealth {
  success: boolean;
  system: string;
  version: string;
  status: "READY" | "DEGRADED";
  metrics: GlobalCloudMetrics;
  components: Record<string, string>;
}
