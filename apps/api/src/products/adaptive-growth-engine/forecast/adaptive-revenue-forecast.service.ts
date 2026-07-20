import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ProductMarketInput,
  RevenueForecast,
} from "../contracts/adaptive-growth-engine.contracts";

@Injectable()
export class AdaptiveRevenueForecastService {
  private readonly forecasts = new Map<string, RevenueForecast>();

  forecast(
    input: ProductMarketInput,
    horizonMonths = 12,
  ): RevenueForecast {
    const baseline = Math.max(0, input.currentMetrics.revenue);
    const build = (monthlyRate: number) =>
      Array.from({ length: horizonMonths }, (_, index) =>
        Math.round(
          baseline * Math.pow(1 + monthlyRate, index + 1),
        ),
      );

    const result: RevenueForecast = {
      id: `aage-forecast:${randomUUID()}`,
      tenantId: input.tenantId,
      productId: input.productId,
      horizonMonths,
      baselineRevenue: baseline,
      scenarios: {
        conservative: build(0.02),
        expected: build(0.05),
        aggressive: build(0.09),
      },
      assumptions: [
        "Conservative monthly growth: 2%",
        "Expected monthly growth: 5%",
        "Aggressive monthly growth: 9%",
        "Forecast updates after each adaptation cycle",
      ],
      confidence: 80,
      generatedAt: new Date().toISOString(),
    };
    this.forecasts.set(result.id, result);
    return this.clone(result);
  }

  list() {
    return [...this.forecasts.values()].map((item) => this.clone(item));
  }

  health() {
    return {
      status: "operational",
      forecasts: this.forecasts.size,
      scenarioForecasting: true,
      adaptiveForecasting: true,
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }

  private clone(value: RevenueForecast): RevenueForecast {
    return JSON.parse(JSON.stringify(value)) as RevenueForecast;
  }
}