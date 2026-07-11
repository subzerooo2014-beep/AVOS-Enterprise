import {
  GenesisIntelligenceSeverity,
  GenesisValidationContext,
  GenesisValidationResult,
  GenesisValidationRule,
} from "./contracts";

export class OptimizationCompletenessRule
  implements GenesisValidationRule {
  readonly key =
    "optimization-completeness";

  readonly name =
    "Optimization Completeness";

  readonly description =
    "Ensures all required capabilities are resolved.";

  readonly severity =
    GenesisIntelligenceSeverity.ERROR;

  readonly enabled = true;

  readonly priority = 10;

  validate(
    context: GenesisValidationContext,
  ): GenesisValidationResult {
    const unresolved =
      context.optimization.unresolvedCapabilities;

    return {
      ruleKey: this.key,
      passed:
        unresolved.length === 0,
      issues:
        unresolved.map(
          (capability) => ({
            code:
              "UNRESOLVED_CAPABILITY",
            severity:
              this.severity,
            message:
              `Required capability is unresolved: ${capability}`,
            subject:
              capability,
            metadata: {},
          }),
        ),
    };
  }
}

export class DependencyIntegrityRule
  implements GenesisValidationRule {
  readonly key =
    "dependency-integrity";

  readonly name =
    "Dependency Integrity";

  readonly description =
    "Rejects missing dependencies and dependency cycles.";

  readonly severity =
    GenesisIntelligenceSeverity.CRITICAL;

  readonly enabled = true;

  readonly priority = 20;

  validate(
    context: GenesisValidationContext,
  ): GenesisValidationResult {
    const analysis =
      context.dependencyAnalysis;

    const issues = [
      ...analysis.missingDependencies.map(
        (dependency) => ({
          code:
            "MISSING_DEPENDENCY",
          severity:
            GenesisIntelligenceSeverity.ERROR,
          message:
            `Missing dependency: ${dependency}`,
          subject:
            dependency,
          metadata: {},
        }),
      ),
      ...analysis.cycles.map(
        (cycle) => ({
          code:
            "DEPENDENCY_CYCLE",
          severity:
            GenesisIntelligenceSeverity.CRITICAL,
          message:
            `Dependency cycle detected: ${cycle.join(" -> ")}`,
          metadata: {
            cycle,
          },
        }),
      ),
    ];

    return {
      ruleKey: this.key,
      passed:
        issues.length === 0,
      issues,
    };
  }
}

export class PlanRiskRule
  implements GenesisValidationRule {
  readonly key =
    "plan-risk";

  readonly name =
    "Plan Risk";

  readonly description =
    "Flags generation plans containing high-risk actions.";

  readonly severity =
    GenesisIntelligenceSeverity.WARNING;

  readonly enabled = true;

  readonly priority = 30;

  validate(
    context: GenesisValidationContext,
  ): GenesisValidationResult {
    const risky =
      context.plan.actions.filter(
        (action) =>
          action.riskScore >= 70,
      );

    return {
      ruleKey: this.key,
      passed: true,
      issues:
        risky.map(
          (action) => ({
            code:
              "HIGH_RISK_ACTION",
            severity:
              this.severity,
            message:
              `High-risk plan action: ${action.key}`,
            subject:
              action.key,
            metadata: {
              riskScore:
                action.riskScore,
            },
          }),
        ),
    };
  }
}

export function createDefaultGenesisValidationRules():
  GenesisValidationRule[] {
  return [
    new OptimizationCompletenessRule(),
    new DependencyIntegrityRule(),
    new PlanRiskRule(),
  ];
}
