export interface AdvancedWindow {
  id: string;
  applicationId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  displayId: string;
  zIndex: number;
}

export interface RuntimeIdentity {
  userId: string;
  displayName: string;
  roles: string[];
  permissions: string[];
  ssoProvider: string;
}

export interface MonitorServiceState {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  latencyMs: number;
  healthScore: number;
  updatedAt: string;
}