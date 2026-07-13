import { Injectable } from "@nestjs/common";

@Injectable()
export class MobilityDnaGraphService {
  compose(input: {
    usageScore: number;
    ownershipScore: number;
    serviceScore: number;
    marketScore: number;
  }) {
    const dnaScore = Math.round(
      input.usageScore * 0.25 +
        input.ownershipScore * 0.25 +
        input.serviceScore * 0.25 +
        input.marketScore * 0.25,
    );

    return {
      dnaScore,
      profile: dnaScore >= 80 ? "PREMIUM" : dnaScore >= 60 ? "STANDARD" : "BASIC",
    };
  }
}
