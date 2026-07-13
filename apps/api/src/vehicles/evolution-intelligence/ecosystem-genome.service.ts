import { Injectable } from "@nestjs/common";

@Injectable()
export class EcosystemGenomeService {
  map(input: {
    partnerScore: number;
    networkScore: number;
    transactionScore: number;
    innovationScore: number;
  }) {
    const genomeScore = Math.round(
      input.partnerScore * 0.25 +
        input.networkScore * 0.25 +
        input.transactionScore * 0.25 +
        input.innovationScore * 0.25,
    );

    return {
      genomeScore,
      state: genomeScore >= 80 ? "THRIVING" : genomeScore >= 60 ? "STABLE" : "FRAGILE",
    };
  }
}
