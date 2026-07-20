export type RuntimeApplication = {
  id: string;
  name: string;
  route: string;
  category: string;
  version: string;
  health: "healthy" | "degraded" | "unhealthy";
  enabled: boolean;
  permissions: string[];
  tenantAware: boolean;
  pluginCount: number;
};
