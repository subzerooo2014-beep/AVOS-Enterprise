import {
  GenesisIntelligenceSeverity,
  GenesisValidationContext,
  GenesisValidationReport,
  GenesisValidationRule,
} from "./contracts";
import {
  createDefaultGenesisValidationRules,
} from "./validation-rules";

export class AutonomousGenesisValidationPipeline {
  private readonly rules =
    new Map<
      string,
      GenesisValidationRule
    >();

  constructor(
    rules:
      readonly GenesisValidationRule[] =
      createDefaultGenesisValidationRules(),
  ) {
    for (const rule of rules) {
      this.register(rule);
    }
  }

  register(
    rule: GenesisValidationRule,
    replace = false,
  ): GenesisValidationRule {
    if (
      this.rules.has(rule.key) &&
      !replace
    ) {
      throw new Error(
        `Genesis validation rule already registered: ${rule.key}`,
      );
    }

    this.rules.set(
      rule.key,
      rule,
    );

    return rule;
  }

  validate(
    context: GenesisValidationContext,
  ): GenesisValidationReport {
    const results =
      this.list()
        .filter(
          (rule) =>
            rule.enabled,
        )
        .map(
          (rule) =>
            rule.validate(context),
        );

    const issues =
      results.flatMap(
        (result) =>
          result.issues,
      );

    const blocking =
      issues.filter(
        (issue) =>
          issue.severity ===
            GenesisIntelligenceSeverity.ERROR ||
          issue.severity ===
            GenesisIntelligenceSeverity.CRITICAL,
      );

    const penalty =
      issues.reduce(
        (total, issue) =>
          total +
          this.penalty(
            issue.severity,
          ),
        0,
      );

    return {
      passed:
        blocking.length === 0,
      score:
        Math.max(
          0,
          100 - penalty,
        ),
      results,
      issues,
      validatedAt:
        new Date().toISOString(),
    };
  }

  list(): GenesisValidationRule[] {
    return Array.from(
      this.rules.values(),
    ).sort(
      (left, right) =>
        left.priority -
        right.priority,
    );
  }

  private penalty(
    severity:
      GenesisIntelligenceSeverity,
  ): number {
    switch (severity) {
      case GenesisIntelligenceSeverity.CRITICAL:
        return 50;
      case GenesisIntelligenceSeverity.ERROR:
        return 25;
      case GenesisIntelligenceSeverity.WARNING:
        return 10;
      case GenesisIntelligenceSeverity.INFO:
        return 2;
    }
  }
}
