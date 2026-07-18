import { Injectable } from "@nestjs/common";
import {
  FailureCategory,
  FailureRecoveryStep,
  FailureSeverity
} from "./failure-diagnosis.contracts";

@Injectable()
export class FailureRecoveryPlannerService {
  plan(
    category: FailureCategory,
    severity: FailureSeverity
  ): FailureRecoveryStep[] {
    const steps: FailureRecoveryStep[] = [
      {
        order: 1,
        title: "Preserve evidence",
        action:
          "Capture the message, stack trace, command, exit code, and workspace state.",
        verification:
          "Diagnostic evidence exists before any mutation.",
        requiresHumanApproval: false
      },
      {
        order: 2,
        title: "Confirm rollback readiness",
        action:
          "Verify that the latest rollback backup exists and is readable.",
        verification:
          "Rollback artifacts are available.",
        requiresHumanApproval: true
      },
      {
        order: 3,
        title: "Apply targeted correction",
        action: this.targetedAction(category),
        verification:
          "The original failure no longer reproduces.",
        requiresHumanApproval: true
      },
      {
        order: 4,
        title: "Run TypeScript verification",
        action:
          "Run pnpm exec tsc --noEmit -p tsconfig.json.",
        verification:
          "TypeScript exits with code 0.",
        requiresHumanApproval: false
      },
      {
        order: 5,
        title: "Run production build",
        action:
          "Run pnpm build from apps/api.",
        verification:
          "NestJS build completes successfully.",
        requiresHumanApproval: false
      },
      {
        order: 6,
        title: "Run runtime smoke",
        action:
          "Restart the API and run the Failure Diagnosis smoke endpoint.",
        verification:
          "Smoke reports success=true and score=100.",
        requiresHumanApproval: false
      }
    ];

    if (severity === "critical") {
      steps.unshift({
        order: 0,
        title: "Freeze automated mutation",
        action:
          "Stop automated changes until explicit human approval is recorded.",
        verification:
          "No automated mutation remains active.",
        requiresHumanApproval: true
      });
    }

    return steps;
  }

  private targetedAction(
    category: FailureCategory
  ): string {
    switch (category) {
      case "typescript":
        return "Repair the first compiler diagnostic and verify all related imports and exports.";
      case "dependency":
        return "Restore the missing package, import, export, or workspace declaration.";
      case "runtime":
        return "Resolve the port, process, startup, or runtime dependency failure.";
      case "filesystem":
        return "Repair the required path, file, directory, or permission.";
      case "configuration":
        return "Correct required application and environment configuration.";
      case "validation":
        return "Correct the rejected payload or generated artifact contract.";
      case "security":
        return "Restore approved identity, policy, permission, and human authorization.";
      default:
        return "Use collected evidence to isolate and repair the smallest reproducible failure.";
    }
  }
}
