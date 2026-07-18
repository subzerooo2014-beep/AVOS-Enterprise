import { Injectable } from "@nestjs/common";
import {
  FailureCategory,
  FailureDiagnosisRequest,
  FailureSeverity,
  FailureSuggestedFix
} from "./failure-diagnosis.contracts";

@Injectable()
export class FailureSuggestedFixGeneratorService {
  generate(
    category: FailureCategory,
    severity: FailureSeverity,
    request: FailureDiagnosisRequest,
    dependencyHints: string[]
  ): FailureSuggestedFix[] {
    const commands = [
      "pnpm exec tsc --noEmit -p tsconfig.json",
      "pnpm build"
    ];

    const fixes: FailureSuggestedFix[] = [];

    if (category === "typescript") {
      fixes.push({
        title: "Repair TypeScript contract",
        description:
          "Correct the first compiler diagnostic, then verify imports, exports, and module boundaries.",
        commands,
        risk: severity,
        requiresHumanApproval: true
      });
    } else if (category === "dependency") {
      fixes.push({
        title: "Restore dependency resolution",
        description:
          dependencyHints.length > 0
            ? `Inspect these dependencies: ${dependencyHints.join(", ")}`
            : "Inspect package installation, imports, exports, and workspace declarations.",
        commands: [
          "pnpm install",
          ...commands
        ],
        risk: severity,
        requiresHumanApproval: true
      });
    } else if (category === "runtime") {
      fixes.push({
        title: "Isolate runtime failure",
        description:
          "Stop the API, verify ports and runtime dependencies, restart it, then rerun smoke tests.",
        commands: ["pnpm start:dev"],
        risk: severity,
        requiresHumanApproval: true
      });
    } else {
      fixes.push({
        title: "Apply targeted recovery",
        description:
          "Preserve evidence, correct the smallest reproducible cause, then rerun verification and build.",
        commands,
        risk: severity,
        requiresHumanApproval: true
      });
    }

    if (request.workspacePath) {
      fixes.push({
        title: "Preserve workspace evidence",
        description:
          `Keep the failing workspace available for inspection: ${request.workspacePath}`,
        commands: [],
        risk: "low",
        requiresHumanApproval: false
      });
    }

    return fixes;
  }
}
