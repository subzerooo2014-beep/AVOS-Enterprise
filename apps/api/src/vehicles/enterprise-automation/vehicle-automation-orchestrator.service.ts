import { Injectable } from "@nestjs/common";
import {
  VehicleAutomationInput,
  VehicleAutomationResult,
} from "./vehicle-automation.types";

@Injectable()
export class VehicleAutomationOrchestratorService {
  orchestrate(
    input: VehicleAutomationInput,
  ): VehicleAutomationResult {
    if (input.decision === "PUBLISH") {
      return {
        vehicleId: input.vehicleId,
        workflow: "vehicle-publication",
        actions: [
          "publish-listing",
          "notify-qualified-buyers",
          "activate-ranking",
        ],
        automated: true,
      };
    }

    if (input.decision === "REVIEW") {
      return {
        vehicleId: input.vehicleId,
        workflow: "vehicle-manual-review",
        actions: [
          "create-review-task",
          "request-evidence",
        ],
        automated: input.priority !== "HIGH",
      };
    }

    return {
      vehicleId: input.vehicleId,
      workflow: "vehicle-block",
      actions: [
        "block-publication",
        "open-risk-case",
      ],
      automated: true,
    };
  }
}
