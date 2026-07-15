import { Injectable } from '@nestjs/common';
import { CampaignMetric } from './enterprise-crm-growth.types';

@Injectable()
export class MarketingCampaignIntelligenceService {
  analyze(metrics: CampaignMetric[]) {
    return metrics.map((metric) => ({
      ...metric,
      openRate:
        metric.delivered === 0
          ? 0
          : Number(((metric.opened / metric.delivered) * 100).toFixed(2)),
      clickRate:
        metric.opened === 0
          ? 0
          : Number(((metric.clicked / metric.opened) * 100).toFixed(2)),
      conversionRate:
        metric.clicked === 0
          ? 0
          : Number(((metric.converted / metric.clicked) * 100).toFixed(2)),
    }));
  }
}