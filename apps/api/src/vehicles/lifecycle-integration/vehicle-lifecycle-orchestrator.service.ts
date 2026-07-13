import { Injectable } from "@nestjs/common";
import { VehicleBrainIntegrationQueueService } from "../brain-integration/vehicle-brain-integration-queue.service";
import { VehicleBrainIntegrationOrchestratorService } from "../brain-integration/vehicle-brain-integration-orchestrator.service";
import { VehicleIntelligenceFinalOrchestratorService } from "../final-intelligence/vehicle-intelligence-final-orchestrator.service";
import { VehicleLifecycleStoreService } from "./vehicle-lifecycle-store.service";
import {
  VehicleLifecycleInput,
  VehicleLifecycleRecord,
} from "./vehicle-lifecycle.types";

@Injectable()
export class VehicleLifecycleOrchestratorService {
  constructor(
    private readonly store: VehicleLifecycleStoreService,
    private readonly brainQueue: VehicleBrainIntegrationQueueService,
    private readonly brainOrchestrator: VehicleBrainIntegrationOrchestratorService,
    private readonly intelligence: VehicleIntelligenceFinalOrchestratorService,
  ) {}

  async start(input: VehicleLifecycleInput): Promise<VehicleLifecycleRecord> {
    const now = new Date().toISOString();
    const record: VehicleLifecycleRecord = {
      id: `vehicle-lifecycle-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      vehicleId: input.vehicleId,
      stage: "CREATED",
      source: input.source ?? "api",
      createdAt: now,
      updatedAt: now,
      payload: input.payload ?? {},
    };

    await this.store.save(record);
    return this.process(record.id);
  }

  async process(id: string): Promise<VehicleLifecycleRecord> {
    const current = this.store.get(id);

    if (!current) {
      throw new Error(`Vehicle lifecycle record not found: ${id}`);
    }

    try {
      const analyzing: VehicleLifecycleRecord = {
        ...current,
        stage: "ANALYZING",
        updatedAt: new Date().toISOString(),
      };
      await this.store.save(analyzing);

      const command = this.brainQueue.enqueue({
        vehicleId: current.vehicleId,
        command: "ANALYZE_VEHICLE",
        payload: current.payload,
      });

      const processed = this.brainOrchestrator.process(command.id);
      const snapshot = this.intelligence.snapshot();

      const completed: VehicleLifecycleRecord = {
        ...analyzing,
        stage: "DECIDED",
        updatedAt: new Date().toISOString(),
        intelligence: {
          version: snapshot.version,
          status: snapshot.status,
          capabilities: snapshot.capabilities.totalCapabilities,
          brainCommandId: processed.id,
          brainCommandStatus: processed.status,
        },
        decision: {
          releaseApproved: snapshot.releaseGate.approved,
          commandMode: snapshot.commandCenter.mode,
          controlStatus: snapshot.controlPlane.status,
          finalStatus: snapshot.status,
        },
      };

      return this.store.save(completed);
    } catch (error) {
      const failed: VehicleLifecycleRecord = {
        ...current,
        stage: "FAILED",
        updatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      };

      return this.store.save(failed);
    }
  }

  list(): VehicleLifecycleRecord[] {
    return this.store.list();
  }

  get(id: string): VehicleLifecycleRecord | undefined {
    return this.store.get(id);
  }
}
