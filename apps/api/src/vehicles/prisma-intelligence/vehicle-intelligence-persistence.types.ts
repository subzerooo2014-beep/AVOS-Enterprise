export interface VehicleIntelligencePersistenceInput {
  lifecycleId: string;
  vehicleId: string;
  source: string;
  stage: string;
  payload?: Record<string, unknown>;
  intelligence?: Record<string, unknown>;
  decision?: Record<string, unknown>;
  error?: string;
}
