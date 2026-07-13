import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleInsuranceEligibilityService {

  evaluate(
    qualityScore: number,
  ) {

    const eligible =
      qualityScore >= 70;

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
