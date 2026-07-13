import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceReleaseGateService {
  evaluate(input: {
    buildPassed: boolean;
    verificationPassed: boolean;
    securityScore: number;
    qualityScore: number;
  }) {
    const approved =
      input.buildPassed &&
      input.verificationPassed &&
      input.securityScore >= 80 &&
      input.qualityScore >= 80;

    return {
      approved,
      gate:
        approved
          ? "RELEASE"
          : input.buildPassed && input.verificationPassed
            ? "CONDITIONAL"
            : "BLOCK",
    };
  }
}
