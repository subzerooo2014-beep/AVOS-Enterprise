import { Injectable } from "@nestjs/common";
import { VehicleLifecycleRecord } from "../lifecycle-integration/vehicle-lifecycle.types";
import { VehicleIntelligencePersistenceService } from "./vehicle-intelligence-persistence.service";

@Injectable()
export class VehicleLifecyclePrismaBridgeService {
  constructor(
    private readonly persistence: VehicleIntelligencePersistenceService,
  ) {}

  persist(record: VehicleLifecycleRecord) {
    return this.persistence.upsert({
      lifecycleId: record.id,
      vehicleId: record.vehicleId,
      source: record.source,
      stage: record.stage,
      payload: record.payload,
      intelligence: record.intelligence,
      decision: record.decision,
      error: record.error,
    });
  }
}
