import { Injectable } from '@nestjs/common';

interface SecurityEvent {
  id: string;
  actorId: string;
  source: string;
  type: string;
  riskScore: number;
  occurredAt: string;
}

@Injectable()
export class SecurityEventCorrelationService {
  correlate(events: SecurityEvent[]) {
    const byActor = new Map<string, SecurityEvent[]>();

    for (const event of events) {
      const existing = byActor.get(event.actorId) ?? [];
      existing.push(event);
      byActor.set(event.actorId, existing);
    }

    const correlations = [...byActor.entries()].map(
      ([actorId, actorEvents]) => ({
        actorId,
        eventCount: actorEvents.length,
        sources: [...new Set(actorEvents.map((event) => event.source))],
        types: [...new Set(actorEvents.map((event) => event.type))],
        aggregateRisk: Math.round(
          actorEvents.reduce(
            (sum, event) => sum + event.riskScore,
            0,
          ) / Math.max(1, actorEvents.length),
        ),
      }),
    );

    return {
      correlations,
      suspiciousActors: correlations
        .filter(
          (correlation) =>
            correlation.aggregateRisk >= 70 ||
            correlation.sources.length >= 3,
        )
        .map((correlation) => correlation.actorId),
    };
  }
}