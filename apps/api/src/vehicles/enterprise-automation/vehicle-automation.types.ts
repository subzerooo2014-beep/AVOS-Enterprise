export interface VehicleAutomationInput {
  vehicleId: string;
  decision: "PUBLISH" | "REVIEW" | "BLOCK";
  priority: "LOW" | "NORMAL" | "HIGH";
}

export interface VehicleAutomationResult {
  vehicleId: string;
  workflow: string;
  actions: string[];
  automated: boolean;
}
