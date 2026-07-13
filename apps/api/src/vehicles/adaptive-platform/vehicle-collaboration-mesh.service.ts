import { Injectable } from "@nestjs/common";
import {
  VehicleCollaborationMeshInput,
  VehicleCollaborationMeshResult,
} from "./vehicle-collaboration-mesh.types";

@Injectable()
export class VehicleCollaborationMeshService {
  evaluate(input: VehicleCollaborationMeshInput): VehicleCollaborationMeshResult {
    const collaborationScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          input.primaryScore * 0.35 +
            input.secondaryScore * 0.25 +
            input.readinessScore * 0.3 -
            input.riskScore * 0.1,
        ),
      ),
    );

    const status =
      collaborationScore >= 82
        ? "ADVANCED"
        : collaborationScore >= 58
          ? "DEVELOPING"
          : "LIMITED";

    return {
      vehicleId: input.vehicleId,
      collaborationScore,
      status,
      actions:
        status === "ADVANCED"
          ? ["scale-capability", "activate-autonomy"]
          : status === "DEVELOPING"
            ? ["optimize-capability", "collect-more-data"]
            : ["manual-review", "rebuild-capability"],
    };
  }
}
