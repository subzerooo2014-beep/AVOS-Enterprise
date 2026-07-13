import { Injectable } from "@nestjs/common";
import { VehicleIntelligenceFinalOrchestratorService } from "../final-intelligence/vehicle-intelligence-final-orchestrator.service";
import { VehicleBrainIntegrationQueueService } from "./vehicle-brain-integration-queue.service";
import { VehicleBrainIntegrationRecord } from "./vehicle-brain-integration.types";

@Injectable()
export class VehicleBrainIntegrationOrchestratorService {
  constructor(
    private readonly queue: VehicleBrainIntegrationQueueService,
    private readonly intelligence: VehicleIntelligenceFinalOrchestratorService,
  ) {}

  process(recordId: string): VehicleBrainIntegrationRecord {
    const record = this.queue.get(recordId);

    if (!record) {
      throw new Error(`Vehicle brain integration record not found: ${recordId}`);
    }

    this.queue.update(recordId, { status: "dispatched" });

    try {
      const snapshot = this.intelligence.snapshot();

      const result = {
        vehicleId: record.vehicleId,
        command: record.command,
        intelligenceVersion: snapshot.version,
        intelligenceStatus: snapshot.status,
        capabilities: snapshot.capabilities.totalCapabilities,
        processedAt: new Date().toISOString(),
      };

      return this.queue.update(recordId, {
        status: "completed",
        result,
      });
    } catch (error) {
      return this.queue.update(recordId, {
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  processLatest(limit = 20): VehicleBrainIntegrationRecord[] {
    return this.queue
      .list()
      .filter((item) => item.status === "queued")
      .slice(0, Math.max(1, Math.min(limit, 100)))
      .map((item) => this.process(item.id));
  }
}
