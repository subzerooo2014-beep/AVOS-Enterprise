import { Injectable } from "@nestjs/common";
import {
  InspectionWorkflowInput,
  InspectionWorkflowResult,
} from "./inspection-workflow.types";

@Injectable()
export class InspectionWorkflowAiService {
  evaluate(
    input: InspectionWorkflowInput,
  ): InspectionWorkflowResult {
    if (input.fraudRisk === "HIGH") {
      return {
        inspectionId: input.inspectionId,
        status: "ESCALATED",
        actions: ["fraud-review", "manual-inspection"],
      };
    }

    if (input.criticalIssues > 0 || input.inspectionScore < 50) {
      return {
        inspectionId: input.inspectionId,
        status: "FAILED",
        actions: ["repair-required", "reinspection"],
      };
    }

    if (input.inspectionScore >= 80) {
      return {
        inspectionId: input.inspectionId,
        status: "PASSED",
        actions: ["approve-inspection", "notify-marketplace"],
      };
    }

    return {
      inspectionId: input.inspectionId,
      status: "IN_PROGRESS",
      actions: ["additional-checks"],
    };
  }
}
