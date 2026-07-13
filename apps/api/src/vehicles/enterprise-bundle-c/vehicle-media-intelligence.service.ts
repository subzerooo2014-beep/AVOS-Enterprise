import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleMediaIntelligenceService {
  evaluate(input: {
    photoQuality: number;
    videoQuality: number;
    coverageScore: number;
    authenticityScore: number;
  }) {
    const mediaScore = Math.round(
      input.photoQuality * 0.3 +
      input.videoQuality * 0.25 +
      input.coverageScore * 0.2 +
      input.authenticityScore * 0.25,
    );

    return {
      mediaScore,
      approved: mediaScore >= 70,
    };
  }
}
