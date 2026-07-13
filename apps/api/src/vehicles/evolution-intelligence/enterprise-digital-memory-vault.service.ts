import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseDigitalMemoryVaultService {
  archive(input: {
    valueScore: number;
    sensitivityScore: number;
    reuseScore: number;
    integrityScore: number;
  }) {
    const archiveScore = Math.round(
      input.valueScore * 0.3 +
        input.reuseScore * 0.25 +
        input.integrityScore * 0.3 +
        input.sensitivityScore * 0.15,
    );

    return {
      archiveScore,
      retention: archiveScore >= 80 ? "PERMANENT" : archiveScore >= 60 ? "LONG_TERM" : "STANDARD",
    };
  }
}
