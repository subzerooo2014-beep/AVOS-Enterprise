import { Injectable } from "@nestjs/common";
import {
  VehicleEnterpriseIntegrationInput,
  VehicleEnterpriseIntegrationResult,
} from "./vehicle-enterprise-integration.types";

@Injectable()
export class VehicleEnterpriseIntegrationService {
  integrate(
    input: VehicleEnterpriseIntegrationInput,
  ): VehicleEnterpriseIntegrationResult {
    const integrationScore = Math.round(
      input.decisionGraphScore * 0.3 +
        input.analyticsHealthScore * 0.3 +
        input.evolutionScore * 0.3 +
        (input.automationReady ? 10 : 0),
    );

    const enterpriseReady =
      integrationScore >= 80 &&
      input.automationReady;

    const status =
      enterpriseReady
        ? "READY"
        : integrationScore >= 55
          ? "PARTIAL"
          : "BLOCKED";

    return {
      vehicleId: input.vehicleId,
      enterpriseReady,
      integrationScore,
      status,
      actions:
        status === "READY"
          ? ["activate-enterprise-flow"]
          : status === "PARTIAL"
            ? ["complete-missing-capabilities"]
            : ["block-enterprise-activation"],
    };
  }
}
