import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseWorkflowService {
  orchestrate(input: {
    approved: boolean;
    inspectionPassed: boolean;
    financeEligible: boolean;
    insuranceEligible: boolean;
  }) {
    const actions: string[] = [];

    if (!input.approved) actions.push("manual-review");
    if (!input.inspectionPassed) actions.push("inspection");
    if (!input.financeEligible) actions.push("finance-review");
    if (!input.insuranceEligible) actions.push("insurance-review");

    if (actions.length === 0) {
      actions.push("publish", "notify-qualified-buyers");
    }

    return {
      status: actions.includes("publish") ? "READY" : "PENDING",
      actions,
    };
  }
}
