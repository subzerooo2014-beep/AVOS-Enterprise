import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceControlPlaneService {
  coordinate(input: {
    modulesHealthy: number;
    policiesActive: number;
    incidentsOpen: number;
    automationScore: number;
  }) {
    const controlScore = Math.max(
      0,
      Math.round(
        input.modulesHealthy * 15 +
          input.policiesActive * 5 +
          input.automationScore * 0.35 -
          input.incidentsOpen * 10,
      ),
    );

    return {
      controlScore,
      status:
        controlScore >= 85
          ? "HEALTHY"
          : controlScore >= 60
            ? "DEGRADED"
            : "CRITICAL",
    };
  }
}
