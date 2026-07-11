import {
  ArchitectureCompatibilityFinding,
  ArchitectureCompatibilityReport,
  ArchitectureMutationPlan,
  ArchitectureSeverity,
  ArchitectureSnapshot,
} from "./contracts";

export class ArchitectureCompatibilityAnalyzer {
  analyze(
    snapshot: ArchitectureSnapshot,
    plan: ArchitectureMutationPlan,
  ): ArchitectureCompatibilityReport {
    const findings:
      ArchitectureCompatibilityFinding[] = [];

    const existingKeys =
      new Set(
        snapshot.nodes.map(
          (node) => node.key,
        ),
      );

    for (const mutation of plan.mutations) {
      if (
        !existingKeys.has(
          mutation.target,
        )
      ) {
        findings.push({
          code:
            "MUTATION_TARGET_NOT_FOUND",
          severity:
            ArchitectureSeverity.ERROR,
          message:
            `Mutation target does not exist: ${mutation.target}`,
          subject:
            mutation.target,
          metadata: {
            mutationKey:
              mutation.key,
          },
        });
      }

      if (
        mutation.expectedRisk >= 80 &&
        !mutation.reversible
      ) {
        findings.push({
          code:
            "IRREVERSIBLE_HIGH_RISK_MUTATION",
          severity:
            ArchitectureSeverity.CRITICAL,
          message:
            `High-risk mutation is not reversible: ${mutation.key}`,
          subject:
            mutation.key,
          metadata: {
            expectedRisk:
              mutation.expectedRisk,
          },
        });
      }
    }

    const penalty =
      findings.reduce(
        (total, finding) =>
          total +
          this.penalty(
            finding.severity,
          ),
        0,
      );

    return {
      compatible:
        !findings.some(
          (finding) =>
            finding.severity ===
              ArchitectureSeverity.ERROR ||
            finding.severity ===
              ArchitectureSeverity.CRITICAL,
        ),
      score:
        Math.max(
          0,
          100 - penalty,
        ),
      findings,
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  private penalty(
    severity: ArchitectureSeverity,
  ): number {
    switch (severity) {
      case ArchitectureSeverity.CRITICAL:
        return 50;
      case ArchitectureSeverity.ERROR:
        return 25;
      case ArchitectureSeverity.WARNING:
        return 10;
      case ArchitectureSeverity.INFO:
        return 2;
    }
  }
}
