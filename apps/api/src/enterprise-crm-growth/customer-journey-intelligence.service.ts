import { Injectable } from '@nestjs/common';
import { CustomerInteraction } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerJourneyIntelligenceService {
  timeline(interactions: CustomerInteraction[]) {
    const sorted = [...interactions].sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() -
        new Date(b.occurredAt).getTime(),
    );

    return {
      interactions: sorted,
      channels: [...new Set(sorted.map((item) => item.channel))],
      latest:
        sorted.length > 0 ? sorted[sorted.length - 1] : null,
      averageSentiment:
        sorted.reduce((sum, item) => sum + item.sentiment, 0) /
        Math.max(1, sorted.length),
    };
  }
}