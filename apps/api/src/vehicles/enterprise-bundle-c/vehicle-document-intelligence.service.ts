import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleDocumentIntelligenceService {
  evaluate(input: {
    ownershipScore: number;
    registrationScore: number;
    inspectionScore: number;
    identityScore: number;
  }) {
    const documentScore = Math.round(
      input.ownershipScore * 0.3 +
      input.registrationScore * 0.25 +
      input.inspectionScore * 0.25 +
      input.identityScore * 0.2,
    );

    return {
      documentScore,
      verified: documentScore >= 80,
    };
  }
}
