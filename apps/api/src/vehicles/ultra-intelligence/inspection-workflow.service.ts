import { Injectable } from "@nestjs/common";
import {
  InspectionWorkflowInput,
  InspectionWorkflowResult,
} from "./inspection-workflow.types";

@Injectable()
export class InspectionWorkflowService {
  evaluate(input: InspectionWorkflowInput): InspectionWorkflowResult {
    if (input.fraudRisk === "HIGH") {
      return {
        status: "ESCALATED",
        actions: ["fraud-review", "manual-inspection"],
      };
    }

    if (input.criticalIssues > 0 || input.inspectionScore < 50) {
      return {
        status: "FAILED",
        actions: ["repair-required", "reinspection"],
      };
    }

    if (input.inspectionScore >= 80) {
      return {
        status: "PASSED",
        actions: ["approve-inspection"],
      };
    }

    return {
      status: "IN_PROGRESS",
      actions: ["additional-checks"],
    };
  }
}
