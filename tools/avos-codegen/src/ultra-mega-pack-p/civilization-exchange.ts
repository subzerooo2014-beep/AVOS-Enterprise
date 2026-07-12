import { randomUUID } from "node:crypto";

export interface CivilizationOffer {
  key: string;
  provider: string;
  category: "capital" | "knowledge" | "capability" | "infrastructure";
  valueScore: number;
  trustScore: number;
  capacity: number;
}

export interface CivilizationDemand {
  key: string;
  category: CivilizationOffer["category"];
  minimumValue: number;
  minimumTrust: number;
  requestedCapacity: number;
}

export interface CivilizationExchangeMatch {
  id: string;
  demandKey: string;
  offerKey: string;
  provider: string;
  score: number;
}

export interface AutonomousCivilizationExchangeResult {
  matches: CivilizationExchangeMatch[];
  unmatchedDemands: string[];
  exchangeScore: number;
  matchedAt: string;
}

export class AutonomousCivilizationExchange {
  match(
    offers: readonly CivilizationOffer[],
    demands: readonly CivilizationDemand[],
  ): AutonomousCivilizationExchangeResult {
    const matches: CivilizationExchangeMatch[] = [];
    const unmatchedDemands: string[] = [];

    for (const demand of demands) {
      const candidate = offers
        .filter(
          (offer) =>
            offer.category === demand.category &&
            offer.valueScore >= demand.minimumValue &&
            offer.trustScore >= demand.minimumTrust &&
            offer.capacity >= demand.requestedCapacity,
        )
        .map((offer) => ({
          offer,
          score: Math.round(
            offer.valueScore * 0.45 +
              offer.trustScore * 0.4 +
              Math.min(100, offer.capacity) * 0.15,
          ),
        }))
        .sort((a, b) => b.score - a.score)[0];

      if (!candidate) {
        unmatchedDemands.push(demand.key);
        continue;
      }

      matches.push({
        id: randomUUID(),
        demandKey: demand.key,
        offerKey: candidate.offer.key,
        provider: candidate.offer.provider,
        score: candidate.score,
      });
    }

    return {
      matches,
      unmatchedDemands,
      exchangeScore:
        matches.length === 0
          ? 0
          : Math.round(
              matches.reduce((sum, match) => sum + match.score, 0) /
                matches.length,
            ),
      matchedAt: new Date().toISOString(),
    };
  }
}
