import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CustomerJourney,
  JourneyTouchpoint,
} from "../contracts/agp-growth-commercial.contracts";

@Injectable()
export class AgpCustomerJourneyIntelligenceService {
  private readonly journeys: CustomerJourney[] = [];

  analyze(input: {
    customerId: string;
    segment: string;
    touchpoints: Array<Omit<JourneyTouchpoint, "id">>;
  }): CustomerJourney {
    const touchpoints: JourneyTouchpoint[] = input.touchpoints.map(
      (touchpoint) => ({
        ...touchpoint,
        id: `agp-touchpoint:${randomUUID()}`,
      }),
    );

    const averageSentiment =
      touchpoints.reduce((sum, item) => sum + item.sentiment, 0) /
      Math.max(touchpoints.length, 1);
    const averageFriction =
      touchpoints.reduce((sum, item) => sum + item.frictionScore, 0) /
      Math.max(touchpoints.length, 1);

    const journeyScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(50 + averageSentiment * 25 - averageFriction * 25),
      ),
    );
    const churnRisk = Math.max(
      0,
      Math.min(1, Number(((averageFriction + (1 - averageSentiment)) / 2).toFixed(4))),
    );

    const journey: CustomerJourney = {
      id: `agp-journey:${randomUUID()}`,
      customerId: input.customerId,
      segment: input.segment,
      touchpoints,
      journeyScore,
      churnRisk,
      recommendedNextAction:
        churnRisk >= 0.7
          ? "Trigger human-reviewed retention workflow."
          : averageFriction >= 0.5
            ? "Remove the highest-friction touchpoint."
            : "Continue personalized engagement.",
      generatedAt: new Date().toISOString(),
    };

    this.journeys.push(journey);
    return JSON.parse(JSON.stringify(journey)) as CustomerJourney;
  }

  list(): CustomerJourney[] {
    return this.journeys.map(
      (journey) => JSON.parse(JSON.stringify(journey)) as CustomerJourney,
    );
  }
}