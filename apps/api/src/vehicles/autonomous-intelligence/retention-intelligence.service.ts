import { Injectable } from "@nestjs/common";

@Injectable()
export class RetentionIntelligenceService {
  evaluate(input: {
    satisfactionScore: number;
    usageScore: number;
    supportScore: number;
    valueScore: number;
  }) {
    const retentionScore = Math.round(
      input.satisfactionScore * 0.3 +
        input.usageScore * 0.25 +
        input.supportScore * 0.2 +
        input.valueScore * 0.25,
    );

    return {
      retentionScore,
      risk: retentionScore >= 75 ? "LOW" : retentionScore >= 50 ? "MEDIUM" : "HIGH",
    };
  }
}
