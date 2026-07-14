import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplaceDemandForecastEngine {
  forecast(values: number[]) {
    const average = values.length ? values.reduce((a,b) => a+b,0) / values.length : 0;
    const last = values.length ? values[values.length - 1] : 0;
    return {
      forecast: Math.round(average * 1.08),
      trend: last > average ? "UP" : last < average ? "DOWN" : "STABLE",
    };
  }
}
