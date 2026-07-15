import { Injectable } from '@nestjs/common';
import { MarketplaceMetric } from './vehicle-marketplace-operations.types';

@Injectable()
export class MarketplaceAnalyticsEngineService {
  analyze(metrics: MarketplaceMetric[]) {
    const totals = metrics.reduce(
      (acc, metric) => ({
        views: acc.views + metric.views,
        inquiries: acc.inquiries + metric.inquiries,
        saves: acc.saves + metric.saves,
        reservations: acc.reservations + metric.reservations,
        conversions: acc.conversions + metric.conversions,
      }),
      {
        views: 0,
        inquiries: 0,
        saves: 0,
        reservations: 0,
        conversions: 0,
      },
    );

    return {
      totals,
      conversionRate:
        totals.views === 0
          ? 0
          : Number(
              ((totals.conversions / totals.views) * 100).toFixed(2),
            ),
      inquiryRate:
        totals.views === 0
          ? 0
          : Number(
              ((totals.inquiries / totals.views) * 100).toFixed(2),
            ),
    };
  }
}