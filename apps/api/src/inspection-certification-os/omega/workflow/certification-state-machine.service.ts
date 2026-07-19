import { Injectable } from "@nestjs/common";
import { CertificationWorkflowState } from "./omega-workflow.types";

@Injectable()
export class CertificationStateMachineService {
  private readonly transitions: Readonly<
    Record<CertificationWorkflowState, readonly CertificationWorkflowState[]>
  > = {
    draft: ["inspection-pending"],
    "inspection-pending": ["inspection-completed", "rejected"],
    "inspection-completed": [
      "remediation-required",
      "approval-pending",
      "rejected",
    ],
    "remediation-required": ["remediation-in-progress", "rejected"],
    "remediation-in-progress": ["verification-pending", "suspended"],
    "verification-pending": [
      "approval-pending",
      "remediation-required",
      "rejected",
    ],
    "approval-pending": ["approved", "rejected", "remediation-required"],
    approved: ["certified", "rejected"],
    rejected: ["draft"],
    certified: ["suspended", "expired", "revoked"],
    suspended: ["certified", "revoked", "expired"],
    expired: ["draft"],
    revoked: ["draft"],
  };

  canTransition(
    from: CertificationWorkflowState,
    to: CertificationWorkflowState,
  ): boolean {
    return this.transitions[from].includes(to);
  }

  allowedTransitions(
    state: CertificationWorkflowState,
  ): readonly CertificationWorkflowState[] {
    return this.transitions[state];
  }

  assertTransition(
    from: CertificationWorkflowState,
    to: CertificationWorkflowState,
  ): void {
    if (!this.canTransition(from, to)) {
      throw new Error(`Invalid certification transition: ${from} -> ${to}`);
    }
  }
}
