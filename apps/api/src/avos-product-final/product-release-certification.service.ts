import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductReleaseCertificationService {
  certify(scores: number[]) {
    const score = Math.round(
      scores.reduce((sum, item) => sum + item, 0) / scores.length,
    );

    return {
      passed: scores.every((item) => item >= 90),
      score,
      releaseCandidate: "AVOS Product 1.0 RC1",
      certifiedAt: new Date().toISOString(),
    };
  }
}