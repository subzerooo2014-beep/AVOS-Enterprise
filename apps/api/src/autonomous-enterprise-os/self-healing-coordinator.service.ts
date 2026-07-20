import { Injectable } from "@nestjs/common";

@Injectable()
export class SelfHealingCoordinatorService {
  coordinate(input: {
    unitKey: string;
    symptom: string;
    severity: "low" | "medium" | "high" | "critical";
  }) {
    const action =
      input.severity === "critical"
        ? "isolate-and-request-human-approval"
        : input.severity === "high"
          ? "restart-through-urp"
          : input.severity === "medium"
            ? "degrade-and-reroute"
            : "observe";

    return {
      unitKey: input.unitKey,
      symptom: input.symptom,
      severity: input.severity,
      recommendedAction: action,
      executableWithoutApproval:
        input.severity === "low" || input.severity === "medium",
      requiresHumanApproval:
        input.severity === "high" || input.severity === "critical",
      status: "coordinated",
      coordinatedAt: new Date().toISOString(),
    };
  }
}