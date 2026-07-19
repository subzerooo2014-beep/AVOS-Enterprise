import { Injectable } from "@nestjs/common";
import {
  CertificationScore,
  InspectionResult,
} from "./inspection-certification.types";

@Injectable()
export class ScoreEngineService {
  calculate(results: readonly InspectionResult[]): CertificationScore {
    const eligible = results.filter((result) => result.status !== "skipped");
    const totalWeight = eligible.reduce((sum, result) => sum + result.weight, 0);
    const passedWeight = eligible
      .filter((result) => result.status === "pass")
      .reduce((sum, result) => sum + result.weight, 0);
    const warningWeight = eligible
      .filter((result) => result.status === "warn")
      .reduce((sum, result) => sum + result.weight, 0);
    const failedWeight = eligible
      .filter((result) => result.status === "fail")
      .reduce((sum, result) => sum + result.weight, 0);

    const score =
      totalWeight === 0
        ? 0
        : Number(((passedWeight / totalWeight) * 100).toFixed(2));

    return {
      totalWeight,
      passedWeight,
      warningWeight,
      failedWeight,
      score,
    };
  }
}
