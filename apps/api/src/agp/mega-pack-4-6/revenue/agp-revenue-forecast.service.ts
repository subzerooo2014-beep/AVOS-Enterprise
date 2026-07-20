import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { RevenueForecast } from "../contracts/agp-revenue.contracts";

@Injectable()
export class AgpRevenueForecastService {
  private latestForecast?: RevenueForecast;

  forecast(input: {
    baselineRevenue: number;
    monthlyGrowthRate: number;
    horizon: number;
    currency: string;
  }): RevenueForecast {
    const points = Array.from({ length: input.horizon }, (_, index) => {
      const predictedRevenue =
        input.baselineRevenue *
        Math.pow(1 + input.monthlyGrowthRate, index + 1);
      const uncertainty = 0.05 + index * 0.015;

      return {
        period: `M${index + 1}`,
        predictedRevenue: Number(predictedRevenue.toFixed(2)),
        lowerBound: Number(
          (predictedRevenue * (1 - uncertainty)).toFixed(2),
        ),
        upperBound: Number(
          (predictedRevenue * (1 + uncertainty)).toFixed(2),
        ),
        confidence: Number(Math.max(0.55, 0.9 - index * 0.03).toFixed(4)),
      };
    });

    this.latestForecast = {
      id: `agp-revenue-forecast:${randomUUID()}`,
      horizon: input.horizon,
      currency: input.currency,
      points,
      assumptions: [
        "Growth rate remains directionally stable.",
        "No major market disruption is applied.",
        "Forecast requires human review before financial commitment.",
      ],
      risks: [
        "Demand volatility.",
        "Pricing changes.",
        "External economic conditions.",
      ],
      generatedAt: new Date().toISOString(),
    };

    return JSON.parse(
      JSON.stringify(this.latestForecast),
    ) as RevenueForecast;
  }

  latest(): RevenueForecast | undefined {
    return this.latestForecast
      ? (JSON.parse(JSON.stringify(this.latestForecast)) as RevenueForecast)
      : undefined;
  }
}