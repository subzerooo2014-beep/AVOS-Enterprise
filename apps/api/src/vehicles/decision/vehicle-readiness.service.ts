import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleReadinessService {

  evaluate(
    vehicle: any,
  ) {

    const reasons: string[] = [];

    let qualityScore = 100;

    if (!vehicle.images || vehicle.images.length < 5) {
      qualityScore -= 15;
      reasons.push("Not enough images");
    }

    if (!vehicle.description || vehicle.description.length < 100) {
      qualityScore -= 10;
      reasons.push("Description too short");
    }

    if (!vehicle.price) {
      qualityScore -= 20;
      reasons.push("Missing price");
    }

    if (!vehicle.location) {
      qualityScore -= 5;
      reasons.push("Missing location");
    }

    let fraudRisk:
      | "low"
      | "medium"
      | "high" = "low";

    if (qualityScore < 70) {
      fraudRisk = "medium";
    }

    if (qualityScore < 50) {
      fraudRisk = "high";
    }

    return {
      qualityScore,
      fraudRisk,
      inspectionReady:
        qualityScore >= 80,
      reasons,
    };

  }

}
