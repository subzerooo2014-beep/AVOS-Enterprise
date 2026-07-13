import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleListingQualityService {
  evaluate(input: {
    mediaScore: number;
    descriptionScore: number;
    documentScore: number;
    completenessScore: number;
  }) {
    const qualityScore = Math.round(
      input.mediaScore * 0.25 +
      input.descriptionScore * 0.2 +
      input.documentScore * 0.3 +
      input.completenessScore * 0.25,
    );

    return {
      qualityScore,
      status:
        qualityScore >= 85
          ? "PREMIUM"
          : qualityScore >= 65
            ? "READY"
            : "INCOMPLETE",
    };
  }
}
