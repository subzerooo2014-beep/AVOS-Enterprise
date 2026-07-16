import { Injectable } from "@nestjs/common";
import type { DecisionResult } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class DecisionObservabilityService {
  private readonly decisions: DecisionResult[] = [];

  record(result: DecisionResult): DecisionResult {
    this.decisions.unshift({
      ...result,
      reasons: [...result.reasons],
      appliedRules: [...result.appliedRules],
    });

    if (this.decisions.length > 1000) this.decisions.length = 1000;

    return {
      ...result,
      reasons: [...result.reasons],
      appliedRules: [...result.appliedRules],
    };
  }

  list(): DecisionResult[] {
    return this.decisions.map((result) => ({
      ...result,
      reasons: [...result.reasons],
      appliedRules: [...result.appliedRules],
    }));
  }

  analytics() {
    return {
      decisions: this.decisions.length,
      approvals: this.decisions.filter((item) => item.outcome === "APPROVE").length,
      rejections: this.decisions.filter((item) => item.outcome === "REJECT").length,
      reviews: this.decisions.filter((item) => item.outcome === "REVIEW").length,
      averageConfidence:
        this.decisions.length === 0
          ? 0
          : Math.round(
              (this.decisions.reduce(
                (sum, item) => sum + item.confidence,
                0,
              ) /
                this.decisions.length) *
                100,
            ) / 100,
    };
  }
}
