import { Injectable } from "@nestjs/common";
import { EventEnvelope, EventPriority } from "./platform-production-mega-pack-4.types";
import { EventRegistryService } from "./event-registry.service";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class UnifiedMessagingService {
  constructor(
    private readonly store: EventMeshFileStoreService,
    private readonly registry: EventRegistryService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  publish(input: {
    eventType: string;
    version: string;
    source: string;
    subject: string;
    correlationId?: string;
    causationId?: string;
    priority?: EventPriority;
    payload: Record<string, unknown>;
    headers?: Record<string, string>;
  }): EventEnvelope {
    this.registry.resolve(input.eventType, input.version);

    const envelope: EventEnvelope = {
      id: this.id("event"),
      eventType: input.eventType,
      version: input.version,
      source: input.source,
      subject: input.subject,
      correlationId: input.correlationId ?? this.id("correlation"),
      causationId: input.causationId,
      priority: input.priority ?? "normal",
      payload: input.payload,
      headers: input.headers ?? {},
      createdAt: this.now(),
    };

    this.store.writeJson(`messages/${envelope.id}.json`, envelope);
    this.store.writeJson("messages/latest.json", envelope);

    return envelope;
  }

  list(): EventEnvelope[] {
    return this.store.listJson<EventEnvelope>("messages");
  }

  latest(): EventEnvelope | null {
    return this.store.readJson<EventEnvelope | null>(
      "messages/latest.json",
      null,
    );
  }
}