import { Injectable } from "@nestjs/common";
import { InspectionPluginResult } from "./inspection-plugin.types";

export interface InspectionPolicyDecision {
  readonly approved: boolean;
  readonly blockingFailures: number;
  readonly warningCount: number;
  readonly reason: string;
  readonly humanFinalAuthority: true;
}

@Injectable()
export class InspectionPolicyService {
  evaluate(
    results: readonly InspectionPluginResult[],
  ): InspectionPolicyDecision {
    const blockingFailures = results.filter(
      (result) =>
        result.status === "fail" && result.severity === "required",
    ).length;

    const warningCount = results.filter(
      (result) => result.status === "warn",
    ).length;

    return {
      approved: blockingFailures === 0,
      blockingFailures,
      warningCount,
      reason:
        blockingFailures === 0
          ? "No required inspection plugin failed."
          : "One or more required inspection plugins failed.",
      humanFinalAuthority: true,
    };
  }
}
