import { Injectable } from "@nestjs/common";
import type { FlowForecast } from "./core-flow-intelligence.types";

@Injectable()
export class CoreFlowForecastService {
  private readonly forecasts: FlowForecast[] = [];

  generate(flow: string, samples: any[], horizon = "next-24h") {
    const normalized = Array.isArray(samples) ? samples : [];
    const volumes = normalized.map((item) => Number(item?.volume ?? 0));
    const durations = normalized.map((item) => Number(item?.durationMs ?? 0));

    const average = (values: number[]) =>
      values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;

    const expectedVolume = Math.max(Math.round(average(volumes)), 0);
    const expectedDurationMs = Math.max(Math.round(average(durations)), 0);
    const confidence = normalized.length >= 10
      ? 0.92
      : normalized.length >= 5
        ? 0.82
        : 0.65;

    const forecast: FlowForecast = {
      id: `forecast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow,
      horizon,
      expectedVolume,
      expectedDurationMs,
      confidence,
      generatedAt: new Date().toISOString(),
    };

    this.forecasts.push(forecast);
    return forecast;
  }

  findAll(flow?: string) {
    return this.forecasts
      .filter((item) => !flow || item.flow === flow)
      .slice()
      .reverse();
  }
}
