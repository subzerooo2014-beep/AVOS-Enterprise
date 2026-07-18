import { Injectable } from "@nestjs/common";
import {
  FailureCategory,
  FailureDiagnosisRequest,
  FailureEvidence,
  FailureRootCause
} from "./failure-diagnosis.contracts";

@Injectable()
export class FailureRootCauseAnalyzerService {
  analyze(
    request: FailureDiagnosisRequest,
    category: FailureCategory,
    dependencyHints: string[],
    stackFrames: string[]
  ): FailureRootCause {
    const evidence: FailureEvidence[] = [];

    evidence.push({
      type: "message",
      value: request.message.trim(),
      confidence: 0.95
    });

    if (typeof request.exitCode === "number") {
      evidence.push({
        type: "exit-code",
        value: String(request.exitCode),
        confidence: 0.8
      });
    }

    if (dependencyHints.length > 0) {
      evidence.push({
        type: "dependency",
        value: dependencyHints.join(", "),
        confidence: 0.85
      });
    }

    if (stackFrames.length > 0) {
      evidence.push({
        type: "stack-frame",
        value: stackFrames[0],
        confidence: 0.75
      });
    }

    const baseConfidence =
      category === "unknown" ? 0.45 : 0.7;

    return {
      category,
      summary: this.buildSummary(category),
      confidence: Math.min(
        0.99,
        Number(
          (
            baseConfidence +
            evidence.length * 0.06
          ).toFixed(2)
        )
      ),
      evidence
    };
  }

  private buildSummary(
    category: FailureCategory
  ): string {
    switch (category) {
      case "typescript":
        return "TypeScript compilation or module contract inconsistency detected.";
      case "dependency":
        return "A package, import, export, or dependency resolution path is unavailable.";
      case "runtime":
        return "The generated capability failed during startup or runtime execution.";
      case "filesystem":
        return "A required file, path, permission, or workspace operation failed.";
      case "configuration":
        return "Required application or environment configuration is inconsistent.";
      case "validation":
        return "Input or generated artifact validation rejected the operation.";
      case "security":
        return "Authorization, policy, or security enforcement blocked the operation.";
      default:
        return "The available evidence is insufficient for a precise classification.";
    }
  }
}
