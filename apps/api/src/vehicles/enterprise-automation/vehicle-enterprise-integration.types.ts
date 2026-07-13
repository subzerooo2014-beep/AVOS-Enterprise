export interface VehicleEnterpriseIntegrationInput {
  vehicleId: string;
  decisionGraphScore: number;
  automationReady: boolean;
  analyticsHealthScore: number;
  evolutionScore: number;
}

export interface VehicleEnterpriseIntegrationResult {
  vehicleId: string;
  enterpriseReady: boolean;
  integrationScore: number;
  status: "READY" | "PARTIAL" | "BLOCKED";
  actions: string[];
}
