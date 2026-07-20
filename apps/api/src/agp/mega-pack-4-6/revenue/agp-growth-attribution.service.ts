import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { GrowthAttribution } from "../contracts/agp-revenue.contracts";

@Injectable()
export class AgpGrowthAttributionService {
  private latestAttribution?: GrowthAttribution;

  attribute(input: {
    model: "first-touch" | "last-touch" | "linear" | "position-based";
    totalRevenue: number;
    channels: string[];
  }): GrowthAttribution {
    const channelCount = Math.max(input.channels.length, 1);
    let weights: number[];

    if (input.model === "first-touch") {
      weights = input.channels.map((_, index) => (index === 0 ? 1 : 0));
    } else if (input.model === "last-touch") {
      weights = input.channels.map((_, index) =>
        index === input.channels.length - 1 ? 1 : 0,
      );
    } else if (input.model === "position-based" && input.channels.length > 1) {
      const middleWeight = 0.2 / Math.max(input.channels.length - 2, 1);
      weights = input.channels.map((_, index) =>
        index === 0 || index === input.channels.length - 1
          ? 0.4
          : middleWeight,
      );
    } else {
      weights = input.channels.map(() => 1 / channelCount);
    }

    this.latestAttribution = {
      id: `agp-attribution:${randomUUID()}`,
      model: input.model,
      totalRevenue: input.totalRevenue,
      touches: input.channels.map((channel, index) => ({
        channel,
        weight: Number((weights[index] ?? 0).toFixed(4)),
        attributedRevenue: Number(
          (input.totalRevenue * (weights[index] ?? 0)).toFixed(2),
        ),
      })),
      generatedAt: new Date().toISOString(),
    };

    return JSON.parse(
      JSON.stringify(this.latestAttribution),
    ) as GrowthAttribution;
  }

  latest(): GrowthAttribution | undefined {
    return this.latestAttribution
      ? (JSON.parse(
          JSON.stringify(this.latestAttribution),
        ) as GrowthAttribution)
      : undefined;
  }
}