import { Injectable } from "@nestjs/common";
import { UnifiedMessagingService } from "./unified-messaging.service";
import { EventRoutingService } from "./event-routing.service";
import { EventStreamsService } from "./event-streams.service";
import { EventObservabilityService } from "./event-observability.service";
import { DeadLetterManagementService } from "./dead-letter-management.service";

@Injectable()
export class PlatformEventMeshService {
  constructor(
    private readonly messaging: UnifiedMessagingService,
    private readonly routing: EventRoutingService,
    private readonly streams: EventStreamsService,
    private readonly observability: EventObservabilityService,
    private readonly deadLetters: DeadLetterManagementService,
  ) {}

  publishAndRoute(input: {
    eventType: string;
    version: string;
    source: string;
    subject: string;
    correlationId?: string;
    payload: Record<string, unknown>;
    headers?: Record<string, string>;
  }): Record<string, unknown> {
    const startedAt = Date.now();
    const envelope = this.messaging.publish(input);

    this.observability.record({
      eventId: envelope.id,
      eventType: envelope.eventType,
      stage: "published",
      success: true,
      durationMs: Date.now() - startedAt,
    });

    this.streams.append(envelope.eventType, envelope);

    try {
      const routes = this.routing.route(envelope);

      return {
        envelope,
        routes,
        status: "routed",
      };
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : "Unknown routing failure";

      this.deadLetters.capture({
        envelope,
        destination: "unresolved",
        attempts: 1,
        reason,
      });

      return {
        envelope,
        routes: [],
        status: "dead-lettered",
        reason,
      };
    }
  }
}