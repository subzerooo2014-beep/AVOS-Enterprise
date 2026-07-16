import { Injectable } from "@nestjs/common";
import type { FoundationIntegrationEventV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationEventIntegrationV1Service {
  private readonly events: FoundationIntegrationEventV1[] = [];

  emit(
    topic: string,
    source: string,
    payload: Record<string, unknown>,
  ): FoundationIntegrationEventV1 {
    const event: FoundationIntegrationEventV1 = {
      id: `foundation-integration-event-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      topic,
      source,
      payload: { ...payload },
      createdAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    return this.clone(event);
  }

  replay(topic?: string): FoundationIntegrationEventV1[] {
    return this.events
      .filter((event) => (topic ? event.topic === topic : true))
      .map((event) => this.clone(event));
  }

  count(): number {
    return this.events.length;
  }

  private clone(item: FoundationIntegrationEventV1): FoundationIntegrationEventV1 {
    return {
      ...item,
      payload: { ...item.payload },
    };
  }
}
