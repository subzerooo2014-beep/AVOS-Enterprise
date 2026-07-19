import { Injectable } from "@nestjs/common";
import { DeadLetterRecord, EventEnvelope } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";
import { EventObservabilityService } from "./event-observability.service";

@Injectable()
export class DeadLetterManagementService {
  constructor(
    private readonly store: EventMeshFileStoreService,
    private readonly observability: EventObservabilityService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  capture(input: {
    envelope: EventEnvelope;
    destination: string;
    attempts: number;
    reason: string;
  }): DeadLetterRecord {
    const record: DeadLetterRecord = {
      id: this.id("dead-letter"),
      envelope: input.envelope,
      destination: input.destination,
      attempts: input.attempts,
      reason: input.reason,
      status: "pending",
      createdAt: this.now(),
    };

    this.store.writeJson(`dead-letters/${record.id}.json`, record);

    this.observability.record({
      eventId: input.envelope.id,
      eventType: input.envelope.eventType,
      destination: input.destination,
      stage: "dead-lettered",
      success: false,
      durationMs: 0,
      detail: input.reason,
    });

    return record;
  }

  replay(id: string): DeadLetterRecord {
    const record = this.get(id);
    const replayed: DeadLetterRecord = {
      ...record,
      status: "replayed",
      replayedAt: this.now(),
    };

    this.store.writeJson(`dead-letters/${replayed.id}.json`, replayed);

    this.observability.record({
      eventId: replayed.envelope.id,
      eventType: replayed.envelope.eventType,
      destination: replayed.destination,
      stage: "replayed",
      success: true,
      durationMs: 0,
    });

    return replayed;
  }

  list(): DeadLetterRecord[] {
    return this.store.listJson<DeadLetterRecord>("dead-letters");
  }

  get(id: string): DeadLetterRecord {
    const record = this.list().find((item) => item.id === id);

    if (!record) {
      throw new Error(`Dead letter not found: ${id}`);
    }

    return record;
  }
}