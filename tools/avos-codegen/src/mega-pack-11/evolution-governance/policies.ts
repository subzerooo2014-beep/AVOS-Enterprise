import {
  EvolutionControl,
  EvolutionPolicyContext,
  EvolutionPolicyRule,
  EvolutionPolicyRuleResult,
  EvolutionRiskLevel,
} from "./contracts";

export class CriticalRiskPolicy
  implements EvolutionPolicyRule {
  readonly key =
    "critical-risk-policy";

  readonly name =
    "Critical Risk Policy";

  readonly description =
    "Blocks critical-risk proposals until explicit human review.";

  readonly enabled = true;

  readonly priority = 10;

  evaluate(
    context: EvolutionPolicyContext,
  ): EvolutionPolicyRuleResult {
    const critical =
      context.risk.level ===
      EvolutionRiskLevel.CRITICAL;

    const controls: EvolutionControl[] =
      critical
        ? [
            {
              key:
                "executive-architecture-approval",
              name:
                "Executive Architecture Approval",
              description:
                "Require explicit executive and architecture approval.",
              mandatory: true,
              evidenceRequired: true,
              metadata: {},
            },
          ]
        : [];

    return {
      ruleKey: this.key,
      passed: !critical,
      blocking: critical,
      message: critical
        ? "Critical-risk proposal requires explicit review."
        : "Proposal is below critical risk.",
      controls,
    };
  }
}

export class BlueprintCompatibilityPolicy
  implements EvolutionPolicyRule {
  readonly key =
    "blueprint-compatibility-policy";

  readonly name =
    "Blueprint Compatibility Policy";

  readonly description =
    "Blocks proposals with incompatible blueprint dependencies.";

  readonly enabled = true;

  readonly priority = 20;

  evaluate(
    context: EvolutionPolicyContext,
  ): EvolutionPolicyRuleResult {
    return {
      ruleKey: this.key,
      passed:
        context.compatibility.compatible,
      blocking:
        !context.compatibility.compatible,
      message:
        context.compatibility.compatible
          ? "All affected blueprints are compatible."
          : "One or more affected blueprints are incompatible.",
      controls:
        context.compatibility.compatible
          ? []
          : [
              {
                key:
                  "resolve-blueprint-compatibility",
                name:
                  "Resolve Blueprint Compatibility",
                description:
                  "Upgrade, replace, or isolate incompatible blueprints.",
                mandatory: true,
                evidenceRequired: true,
                metadata: {},
              },
            ],
    };
  }
}

export class RollbackReadinessPolicy
  implements EvolutionPolicyRule {
  readonly key =
    "rollback-readiness-policy";

  readonly name =
    "Rollback Readiness Policy";

  readonly description =
    "Requires rollback controls for high-impact changes.";

  readonly enabled = true;

  readonly priority = 30;

  evaluate(
    context: EvolutionPolicyContext,
  ): EvolutionPolicyRuleResult {
    const needsRollback =
      context.proposal.estimatedImpact >= 7 ||
      context.risk.score >= 60;

    return {
      ruleKey: this.key,
      passed: true,
      blocking: false,
      message: needsRollback
        ? "Rollback control is required."
        : "Rollback control is optional.",
      controls: needsRollback
        ? [
            {
              key:
                "tested-rollback-procedure",
              name:
                "Tested Rollback Procedure",
              description:
                "Create and test a deterministic rollback procedure.",
              mandatory: true,
              evidenceRequired: true,
              metadata: {},
            },
          ]
        : [],
    };
  }
}

export function createDefaultEvolutionPolicies():
  EvolutionPolicyRule[] {
  return [
    new CriticalRiskPolicy(),
    new BlueprintCompatibilityPolicy(),
    new RollbackReadinessPolicy(),
  ];
}
