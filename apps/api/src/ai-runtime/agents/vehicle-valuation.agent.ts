import { AiAgent, AgentResult } from "./agent.interface";

export class VehicleValuationAgent implements AiAgent {
  name = "VehicleValuationAgent";

  supports(taskType: string) {
    return taskType === "vehicle_valuation";
  }

  async execute(input: any): Promise<AgentResult> {

    const year = Number(input?.year || 2020);

    let basePrice = 35000;

    if (year >= 2025) basePrice = 47000;
    else if (year >= 2024) basePrice = 42000;
    else if (year >= 2023) basePrice = 39000;
    else if (year >= 2022) basePrice = 36000;
    else basePrice = 30000;

    const demand =
      input?.make === "Toyota"
        ? 94
        : input?.make === "Lexus"
        ? 91
        : input?.make === "Mercedes"
        ? 90
        : 82;

    const confidence =
      Math.min(
        99,
        70 +
        (input?.make ? 8 : 0) +
        (input?.model ? 8 : 0) +
        (input?.location ? 6 : 0) +
        (input?.year ? 6 : 0)
      );

    const daysToSell =
      demand >= 92
        ? 14
        : demand >= 88
        ? 20
        : 35;

    const recommendedPrice = Math.round(basePrice * 1.02);

    return {

      status: "success",

      confidence,

      reason:
        "Vehicle valuation calculated using year, brand, demand and local market heuristics.",

      output: {

        estimatedPrice: basePrice,

        recommendedPrice,

        minimumPrice: Math.round(basePrice * 0.93),

        maximumPrice: Math.round(basePrice * 1.08),

        demandScore: demand,

        expectedDaysToSell: daysToSell,

        market: input?.location || "Dubai",

        valuationModel: "AVOS-V1",

        explanation: [

          "Vehicle age",

          "Brand demand",

          "Market location",

          "Pricing heuristic"

        ]

      }

    };

  }

}
