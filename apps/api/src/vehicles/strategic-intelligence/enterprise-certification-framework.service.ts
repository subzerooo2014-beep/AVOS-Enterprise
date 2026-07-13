import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseCertificationFrameworkService {
  certify(input: {
    complianceScore: number;
    qualityScore: number;
    securityScore: number;
    reliabilityScore: number;
  }) {
    const certificationScore = Math.round(
      input.complianceScore * 0.25 +
        input.qualityScore * 0.25 +
        input.securityScore * 0.25 +
        input.reliabilityScore * 0.25,
    );

    return {
      certificationScore,
      certified: certificationScore >= 80,
    };
  }
}
