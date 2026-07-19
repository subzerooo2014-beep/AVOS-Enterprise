import { Injectable } from "@nestjs/common";
import { OmegaIntelligenceSection } from "./omega-intelligence.types";

@Injectable()
export class ReleaseReadinessEngineService {
  evaluate(
    sections: readonly OmegaIntelligenceSection[],
  ): {
    readonly level:
      | "production-ready"
      | "conditionally-ready"
      | "remediation-required";
    readonly blockers: readonly string[];
    readonly warnings: readonly string[];
  } {
    const blockers = sections
      .filter((section) => section.status === "critical")
      .map((section) => section.name);

    const warnings = sections
      .filter(
        (section) =>
          section.status === "attention" ||
          section.status === "not-configured" ||
          section.status === "heuristic-only",
      )
      .map((section) => section.name);

    return {
      level:
        blockers.length > 0
          ? "remediation-required"
          : warnings.length > 0
            ? "conditionally-ready"
            : "production-ready",
      blockers,
      warnings,
    };
  }
}
