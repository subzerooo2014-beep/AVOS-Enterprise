import { Injectable } from "@nestjs/common";

@Injectable()
export class FleetDemandEngine {
  forecast(input: { recentTrips: number[] }) {
    const average =
      input.recentTrips.length
        ? input.recentTrips.reduce((a, b) => a + b, 0) / input.recentTrips.length
        : 0;

    const lastTrip =
      input.recentTrips.length > 0
        ? input.recentTrips[input.recentTrips.length - 1]
        : 0;

    return {
      forecastTrips: Math.round(average * 1.08),
      trend: lastTrip > average ? "UP" : "STABLE",
    };
  }
}
