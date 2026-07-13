import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleMarketplaceScoreService {

  calculate(
    qualityScore: number,
    financeEligible: boolean,
    insuranceEligible: boolean,
  ): number {

    let score = qualityScore;

    if (financeEligible) {
      score += 5;
    }

    if (insuranceEligible) {
      score += 5;
    }

    return Math.min(
      100,
      score,
    );

  }

}
