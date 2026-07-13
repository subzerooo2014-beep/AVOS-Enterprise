import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleServiceNetworkReadinessService {
  evaluate(input: {
    workshopCoverage: number;
    partsAvailability: number;
    responseSpeed: number;
    serviceQuality: number;
  }) {
    const score = Math.round(
      input.workshopCoverage * 0.25 +
      input.partsAvailability * 0.25 +
      input.responseSpeed * 0.2 +
      input.serviceQuality * 0.3,
    );

    return {
      score,
      level: score >= 80 ? "STRONG" : score >= 60 ? "ADEQUATE" : "LIMITED",
    };
  }
}
