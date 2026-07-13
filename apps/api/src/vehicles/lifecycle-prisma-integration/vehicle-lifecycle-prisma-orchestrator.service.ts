import { Injectable } from "@nestjs/common";
import { VehicleLifecycleOrchestratorService } from "../lifecycle-integration/vehicle-lifecycle-orchestrator.service";
import { VehicleIntelligencePersistenceService } from "../prisma-intelligence/vehicle-intelligence-persistence.service";
import {
  VehicleLifecycleInput,
  VehicleLifecycleRecord,
} from "../lifecycle-integration/vehicle-lifecycle.types";

@Injectable()
export class VehicleLifecyclePrismaOrchestratorService {
  constructor(
    private readonly lifecycle: VehicleLifecycleOrchestratorService,
    private readonly persistence: VehicleIntelligencePersistenceService,
  ) {}

  async start(
    input: VehicleLifecycleInput,
  ): Promise<VehicleLifecycleRecord> {
    const record = await this.lifecycle.start(input);
    await this.persist(record);
    return record;
  }

  async process(id: string): Promise<VehicleLifecycleRecord> {
    const record = await this.lifecycle.process(id);
    await this.persist(record);
    return record;
  }

  async persist(record: VehicleLifecycleRecord) {
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
