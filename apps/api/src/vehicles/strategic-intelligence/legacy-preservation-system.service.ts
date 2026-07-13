import { Injectable } from "@nestjs/common";

@Injectable()
export class LegacyPreservationSystemService {
  evaluate(input: {
    businessValue: number;
    replacementRisk: number;
    documentationScore: number;
    migrationReadiness: number;
  }) {
    const preservationScore = Math.round(
      input.businessValue * 0.35 +
        input.replacementRisk * 0.25 +
        input.documentationScore * 0.2 +
        input.migrationReadiness * 0.2,
    );

    return {
      preservationScore,
      strategy:
        preservationScore >= 80
          ? "PRESERVE"
          : preservationScore >= 60
            ? "MODERNIZE"
            : "RETIRE",
    };
  }
}
