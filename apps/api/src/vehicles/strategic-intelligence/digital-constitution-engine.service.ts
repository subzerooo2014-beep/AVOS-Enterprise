import { Injectable } from "@nestjs/common";

@Injectable()
export class DigitalConstitutionEngineService {
  evaluate(input: {
    policyScore: number;
    rightsScore: number;
    accountabilityScore: number;
    transparencyScore: number;
  }) {
    const constitutionScore = Math.round(
      input.policyScore * 0.25 +
        input.rightsScore * 0.25 +
        input.accountabilityScore * 0.25 +
        input.transparencyScore * 0.25,
    );

    return {
      constitutionScore,
      compliant: constitutionScore >= 80,
    };
  }
}
