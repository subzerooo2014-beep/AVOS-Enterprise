export interface VehicleIntelligencePlatformHealth {
  status: "healthy" | "degraded";
  modules: {
    enterpriseIntelligence: boolean;
    ultraIntelligence: boolean;
    autonomousIntelligence: boolean;
    evolutionIntelligence: boolean;
  };
  capabilities: number;
  version: string;
}
