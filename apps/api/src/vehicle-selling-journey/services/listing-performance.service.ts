import { Injectable } from "@nestjs/common";
@Injectable()
export class ListingPerformanceService {
  evaluate(input: { views: number; leads: number; offers: number }) {
    return {
      leadConversion: input.views ? Math.round((input.leads / input.views) * 100) : 0,
      offerConversion: input.leads ? Math.round((input.offers / input.leads) * 100) : 0,
    };
  }
}
