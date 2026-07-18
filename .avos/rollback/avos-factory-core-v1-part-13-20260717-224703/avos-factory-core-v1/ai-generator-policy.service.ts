import { Injectable } from "@nestjs/common";
import {
  AiGenerationPolicyDecision,
  AiGenerationRequest,
  AiPromptAnalysis
} from "./ai-generator.contracts";

@Injectable()
export class AiGeneratorPolicyService {
  private readonly blockedPatterns = [
    "drop database",
    "format disk",
    "disable authentication",
    "disable authorization",
    "expose secrets",
    "steal credentials",
    "remove all files"
  ];

  evaluate(
    request: AiGenerationRequest,
    analysis: AiPromptAnalysis
  ): AiGenerationPolicyDecision {
    const normalized =
      request.prompt.toLowerCase();

    const detected =
      this.blockedPatterns.filter(
        (pattern) =>
          normalized.includes(pattern)
      );

    const reasons: string[] = [];

    if (detected.length > 0) {
      reasons.push(
        "The request contains blocked destructive or security-sensitive patterns."
      );
    }

    if (
      analysis.riskLevel === "critical"
    ) {
      reasons.push(
        "Critical-risk generation cannot execute automatically."
      );
    }

    const allowed =
      detected.length === 0 &&
      analysis.riskLevel !== "critical";

    return {
      allowed,
      requiresHumanApproval:
        analysis.requiresHumanApproval ||
        analysis.riskLevel === "high" ||
        request.overwrite === true,
      riskLevel:
        analysis.riskLevel,
      reasons,
      blockedPatterns:
        detected
    };
  }
}
