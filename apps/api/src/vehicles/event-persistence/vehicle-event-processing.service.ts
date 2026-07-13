import { Injectable } from "@nestjs/common";
import { VehicleLifecyclePrismaOrchestratorService } from "../lifecycle-prisma-integration/vehicle-lifecycle-prisma-orchestrator.service";
import { VehicleEventPersistenceStoreService } from "./vehicle-event-persistence-store.service";
import { VehicleEventRecord } from "./vehicle-event-persistence.types";

@Injectable()
export class VehicleEventProcessingService {
  constructor(
    private readonly store: VehicleEventPersistenceStoreService,
    private readonly lifecycle: VehicleLifecyclePrismaOrchestratorService,
  ) {}

  async process(id: string): Promise<VehicleEventRecord> {
    const event = this.store.get(id);

    if (!event) {
      throw new Error(`Vehicle event not found: ${id}`);
    }

    if (event.status === "COMPLETED") {
      return event;
    }

    const processing = this.store.update(
      id,
      {
        status: "PROCESSING",
        attempts: event.attempts + 1,
        error: undefined,
      },
      "PROCESSING_STARTED",
    );

    try {
      const lifecycle = await this.lifecycle.start({
        vehicleId: processing.vehicleId,
        source: `event:${processing.eventType}`,
        payload: processing.payload,
      });

      return this.store.update(
        id,
        {
          status: "COMPLETED",
          result: {
            lifecycleId: lifecycle.id,
            lifecycleStage: lifecycle.stage,
            intelligenceVersion:
              lifecycle.intelligence?.version,
            brainCommandStatus:
              lifecycle.intelligence?.brainCommandStatus,
            finalStatus: lifecycle.decision?.finalStatus,
          },
          completedAt: new Date().toISOString(),
        },
        "PROCESSING_COMPLETED",
      );
    } catch (error) {
      const current = this.store.get(id) ?? processing;
      const failed = current.attempts >= current.maxAttempts;

      return this.store.update(
        id,
        {
          status: "FAILED",
          error:
            error instanceof Error
              ? error.message
              : String(error),
        },
        failed
          ? "PROCESSING_FAILED_FINAL"
          : "PROCESSING_FAILED_RETRYABLE",
      );
    }
  }

  async retry(id: string): Promise<VehicleEventRecord> {
    const event = this.store.get(id);

    if (!event) {
      throw new Error(`Vehicle event not found: ${id}`);
    }

    if (event.attempts >= event.maxAttempts) {
      throw new Error(
        `Maximum attempts reached for event: ${id}`,
      );
    }

    this.store.update(
      id,
      { status: "PENDING", error: undefined },
      "RETRY_QUEUED",
    );

    return this.process(id);
  }

  async replay(id: string): Promise<VehicleEventRecord> {
    const event = this.store.get(id);

    if (!event) {
      throw new Error(`Vehicle event not found: ${id}`);
    }

    const replay = this.store.create({
      vehicleId: event.vehicleId,
      eventType: `${event.eventType}.REPLAY`,
      payload: {
        ...event.payload,
        replayedFromEventId: event.id,
      },
      maxAttempts: event.maxAttempts,
    });

    this.store.audit(replay.id, "REPLAY_CREATED", {
      originalEventId: event.id,
    });

    return this.process(replay.id);
  }

  async processPending(limit = 20): Promise<VehicleEventRecord[]> {
    const pending = this.store
      .list("PENDING")
      .slice(0, Math.max(1, Math.min(limit, 100)));

    const results: VehicleEventRecord[] = [];

    for (const event of pending) {
      results.push(await this.process(event.id));
    }

    return results;
  }
}
