import { Injectable } from "@nestjs/common";
import {
  VehiclePartnerNetworkInput,
  VehiclePartnerNetworkResult,
} from "./vehicle-partner-network.types";

@Injectable()
export class VehiclePartnerNetworkService {
  evaluate(input: VehiclePartnerNetworkInput): VehiclePartnerNetworkResult {
    const partnerScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.primaryScore * 0.5 +
            input.secondaryScore * 0.35 -
            input.riskScore * 0.15,
        ),
      ),
    );

    const status =
      partnerScore >= 80
        ? "STRONG"
        : partnerScore >= 55
          ? "WATCH"
          : "WEAK";

    return {
      vehicleId: input.vehicleId,
      partnerScore,
      status,
      recommendations:
        status === "STRONG"
          ? ["scale-capability"]
          : status === "WATCH"
            ? ["optimize-capability"]
            : ["manual-intervention"],
    };
  }
}
