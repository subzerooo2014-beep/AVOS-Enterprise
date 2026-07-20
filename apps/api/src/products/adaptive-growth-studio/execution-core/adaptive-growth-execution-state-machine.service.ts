import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { AgsExecutionState } from "./adaptive-growth-execution.contracts";

@Injectable()
export class AdaptiveGrowthExecutionStateMachineService {
  private readonly transitions:
    Record<AgsExecutionState, AgsExecutionState[]> = {
      draft: [
        "pending-approval",
        "approved",
        "cancelled",
      ],
      "pending-approval": [
        "approved",
        "cancelled",
      ],
      approved: [
        "queued",
        "cancelled",
      ],
      queued: [
        "running",
        "cancelled",
      ],
      running: [
        "completed",
        "failed",
        "cancelled",
      ],
      completed: [
        "rolled-back",
      ],
      failed: [
        "queued",
        "cancelled",
      ],
      cancelled: [],
      "rolled-back": [],
    };

  canTransition(
    from: AgsExecutionState,
    to: AgsExecutionState,
  ): boolean {
    return this.transitions[from].includes(to);
  }

  assertTransition(
    from: AgsExecutionState,
    to: AgsExecutionState,
  ): void {
    if (!this.canTransition(from, to)) {
      throw new BadRequestException(
        `Invalid execution transition: ${from} -> ${to}`,
      );
    }
  }

  describe() {
    return {
      status: "operational",
      states: Object.keys(this.transitions),
      transitions: this.transitions,
      approvalBoundary:
        "pending-approval -> approved",
      approvalGovernanceTarget:
        "Mega Pack 2B",
    };
  }
}