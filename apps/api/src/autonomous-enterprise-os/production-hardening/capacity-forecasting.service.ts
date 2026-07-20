import { Injectable } from "@nestjs/common";
import { RuntimeSignalDto } from "./dto/aeos-production.dto";

@Injectable()
export class CapacityForecastingService {
  forecast(signals: RuntimeSignalDto[]) {
    const values = signals
      .map((item) => item.capacityUsed)
      .filter((value): value is number => typeof value === "number");

    const current = values.length > 0 ? values[values.length - 1] : 0;
    const previous = values.length > 1 ? values[values.length - 2] : current;
    const trend = current - previous;
    const projected = Math.max(0, Math.min(1, current + trend * 3));

    return {
      currentUtilization: current,
      projectedUtilization: projected,
      trend: trend > 0.02 ? "increasing" : trend < -0.02 ? "decreasing" : "stable",
      scaleRecommended: projected >= 0.85,
      forecastedAt: new Date().toISOString(),
    };
  }
}