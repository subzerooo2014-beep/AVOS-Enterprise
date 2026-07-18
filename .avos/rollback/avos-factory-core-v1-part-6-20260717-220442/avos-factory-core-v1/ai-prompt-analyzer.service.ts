import { Injectable } from "@nestjs/common";
import {
  AiGenerationIntent,
  AiGenerationRequest,
  AiPromptAnalysis
} from "./ai-generator.contracts";

@Injectable()
export class AiPromptAnalyzerService {
  analyze(
    request: AiGenerationRequest
  ): AiPromptAnalysis {
    const prompt =
      request.prompt.trim();

    const normalized =
      prompt.toLowerCase();

    const intent =
      this.detectIntent(normalized);

    const requestedName =
      this.detectName(prompt, intent);

    const target =
      request.preferredTarget ??
      this.mapIntentToTarget(intent);

    const providerId =
      request.preferredProviderId ??
      "avos.typescript-code-generator";

    const keywords =
      this.extractKeywords(normalized);

    const risk =
      this.detectRisk(normalized);

    const requestedArtifacts =
      this.detectArtifacts(intent);

    const reasons = [
      `Detected intent: ${intent}.`,
      `Selected target: ${target}.`,
      `Selected provider: ${providerId}.`
    ];

    if (
      risk.level !== "low"
    ) {
      reasons.push(
        ...risk.reasons
      );
    }

    const confidence =
      this.calculateConfidence(
        intent,
        requestedName,
        keywords
      );

    return {
      intent,
      confidence,
      requestedName,
      target,
      providerId,
      requestedArtifacts,
      keywords,
      requiresHumanApproval:
        risk.requiresApproval ||
        request.overwrite === true,
      riskLevel: risk.level,
      reasons
    };
  }

  private detectIntent(
    prompt: string
  ): AiGenerationIntent {
    if (
      this.containsAny(prompt, [
        "controller",
        "endpoint",
        "api route"
      ])
    ) {
      return "create-controller";
    }

    if (
      this.containsAny(prompt, [
        "service",
        "business logic",
        "provider"
      ])
    ) {
      return "create-service";
    }

    if (
      this.containsAny(prompt, [
        "module",
        "nestjs module"
      ])
    ) {
      return "create-module";
    }

    if (
      this.containsAny(prompt, [
        "feature",
        "capability"
      ])
    ) {
      return "create-feature";
    }

    if (
      this.containsAny(prompt, [
        "typescript",
        "interface",
        "class",
        "type"
      ])
    ) {
      return "create-typescript";
    }

    return "unknown";
  }

  private detectName(
    prompt: string,
    intent: AiGenerationIntent
  ): string {
    const quoted =
      prompt.match(
        /["'`](.+?)["'`]/
      );

    if (
      quoted?.[1] &&
      quoted[1].trim().length > 0
    ) {
      return quoted[1].trim();
    }

    const named =
      prompt.match(
        /(?:named|called|اسم|باسم)\s+([A-Za-z0-9_-]+)/i
      );

    if (
      named?.[1] &&
      named[1].trim().length > 0
    ) {
      return named[1].trim();
    }

    const fallback =
      intent
        .replace("create-", "")
        .replace(/-/g, " ");

    return `avos ${fallback}`;
  }

  private mapIntentToTarget(
    intent: AiGenerationIntent
  ): string {
    switch (intent) {
      case "create-service":
        return "nestjs-service";

      case "create-controller":
        return "nestjs-controller";

      case "create-module":
        return "nestjs-module";

      case "create-typescript":
      case "create-feature":
      case "unknown":
      default:
        return "typescript";
    }
  }

  private detectArtifacts(
    intent: AiGenerationIntent
  ): string[] {
    switch (intent) {
      case "create-service":
        return ["service"];

      case "create-controller":
        return ["controller"];

      case "create-module":
        return ["module"];

      case "create-feature":
        return [
          "service",
          "controller",
          "module"
        ];

      case "create-typescript":
      case "unknown":
      default:
        return ["typescript"];
    }
  }

  private detectRisk(
    prompt: string
  ): {
    level:
      "low" |
      "medium" |
      "high" |
      "critical";
    requiresApproval: boolean;
    reasons: string[];
  } {
    const criticalPatterns = [
      "delete database",
      "drop database",
      "format disk",
      "remove all files",
      "disable security"
    ];

    const highPatterns = [
      "overwrite",
      "delete files",
      "production",
      "credentials",
      "secret",
      "authentication",
      "authorization"
    ];

    if (
      this.containsAny(
        prompt,
        criticalPatterns
      )
    ) {
      return {
        level: "critical",
        requiresApproval: true,
        reasons: [
          "Critical destructive or security-sensitive intent detected."
        ]
      };
    }

    if (
      this.containsAny(
        prompt,
        highPatterns
      )
    ) {
      return {
        level: "high",
        requiresApproval: true,
        reasons: [
          "High-risk or security-sensitive intent detected."
        ]
      };
    }

    if (
      this.containsAny(prompt, [
        "update",
        "modify",
        "replace",
        "migration"
      ])
    ) {
      return {
        level: "medium",
        requiresApproval: true,
        reasons: [
          "Existing assets may be modified."
        ]
      };
    }

    return {
      level: "low",
      requiresApproval: false,
      reasons: []
    };
  }

  private calculateConfidence(
    intent: AiGenerationIntent,
    requestedName: string,
    keywords: string[]
  ): number {
    let score = 0.45;

    if (intent !== "unknown") {
      score += 0.3;
    }

    if (
      requestedName.length > 3
    ) {
      score += 0.15;
    }

    if (keywords.length >= 3) {
      score += 0.1;
    }

    return Math.min(
      1,
      Number(score.toFixed(2))
    );
  }

  private extractKeywords(
    prompt: string
  ): string[] {
    const ignored =
      new Set([
        "create",
        "build",
        "make",
        "generate",
        "with",
        "from",
        "that",
        "this",
        "and",
        "the",
        "for",
        "into"
      ]);

    return [
      ...new Set(
        prompt
          .split(
            /[^a-z0-9_-]+/i
          )
          .filter(
            (word) =>
              word.length > 2 &&
              !ignored.has(word)
          )
      )
    ].slice(0, 20);
  }

  private containsAny(
    source: string,
    values: string[]
  ): boolean {
    return values.some(
      (value) =>
        source.includes(value)
    );
  }
}
