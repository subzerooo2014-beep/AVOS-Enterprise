import { Injectable } from "@nestjs/common";
import { EventObservation } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class EventObservabilityService {
  constructor(
    private readonly store: EventMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  record(
    input: Omit<EventObservation, "id" | "createdAt">,
  ): EventObservation {
    const observation: EventObservation = {
      ...input,
      id: this.id("event-observation"),
      createdAt: this.now(),
    };

    this.store.writeJson(
      `observability/${observation.id}.json`,
      observation,
    );

    return observation;
  }

  list(): EventObservation[] {
    return this.store.listJson<EventObservation>("observability");
  }

  metrics(): Record<string, unknown> {
    const observations = this.list();
    const success = observations.filter((item) => item.success).length;
    const failed = observations.length - success;

    return {
      total: observations.length,
      success,
      failed,
      successRate:
        observations.length === 0
          ? 100
          : Math.round((success / observations.length) * 100),
      averageDurationMs:
        observations.length === 0
          ? 0
          : Math.round(
              observations.reduce(
                (sum, item) => sum + item.durationMs,
                0,
              ) / observations.length,
            ),
    };
  }
}