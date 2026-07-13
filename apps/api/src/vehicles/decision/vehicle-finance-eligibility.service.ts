import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleFinanceEligibilityService {

  evaluate(
    qualityScore: number,
  ) {

    const eligible =
      qualityScore >= 75;

    return {
      eligible,
      score:
        eligible
          ? 100
          : Math.max(
              0,
              qualityScore,
            ),
    };

  }

}
