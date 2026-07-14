import { Injectable } from '@nestjs/common';
import { FederatedEvent } from './enterprise-integration-federation.types';

@Injectable()
export class EnterpriseEventFederationService {
  federate(events: FederatedEvent[]) {
    const deduplicated = [
      ...new Map(
        events.map((event) => [`${event.source}:${event.id}`, event]),
      ).values(),
    ];

    const topics = new Map<string, FederatedEvent[]>();
    for (const event of deduplicated) {
      const existing = topics.get(event.topic) ?? [];
      existing.push(event);
      topics.set(event.topic, existing);
    }

    return {
      eventCount: deduplicated.length,
      topics: [...topics.entries()].map(([topic, topicEvents]) => ({
        topic,
        events: topicEvents.length,
        latestVersion: Math.max(
          ...topicEvents.map((event) => event.version),
        ),
      })),
      sources: [...new Set(deduplicated.map((event) => event.source))],
    };
  }
}