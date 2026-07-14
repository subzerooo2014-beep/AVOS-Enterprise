import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceAnalyticsService {
  calculate(input: { views: number; leads: number; orders: number; revenue: number }) {
    return {
      leadConversion: input.views ? Math.round((input.leads / input.views) * 100) : 0,
      orderConversion: input.leads ? Math.round((input.orders / input.leads) * 100) : 0,
      averageOrderValue: input.orders ? Math.round((input.revenue / input.orders) * 100) / 100 : 0,
    };
  }
}
