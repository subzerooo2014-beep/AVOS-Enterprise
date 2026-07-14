import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetKpiService {
  calculate(input: { revenue: number; cost: number; distanceKm: number; trips: number }) {
    return {
      margin: input.revenue - input.cost,
      costPerKm: input.distanceKm ? Math.round((input.cost / input.distanceKm) * 100) / 100 : 0,
      revenuePerTrip: input.trips ? Math.round((input.revenue / input.trips) * 100) / 100 : 0,
    };
  }
}
