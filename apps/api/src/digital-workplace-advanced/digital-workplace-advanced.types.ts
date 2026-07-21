export interface RuntimeIdentity {
  userId: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  ssoProvider: string;
}

export interface MicroFrontendManifest {
  id: string;
  name: string;
  remoteEntry: string;
  exposedModule: string;
  route: string;
  sharedDependencies: string[];
  isolationMode: 'iframe' | 'module-federation' | 'sandbox';
  enabled: boolean;
}

export interface EventEnvelope {
  id: string;
  topic: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface MonitorServiceState {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  latencyMs: number;
  healthScore: number;
  updatedAt: string;
}