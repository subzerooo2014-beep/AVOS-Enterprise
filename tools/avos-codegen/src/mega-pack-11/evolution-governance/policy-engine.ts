import {
  EvolutionDecision,
  EvolutionPolicyContext,
  EvolutionPolicyDecision,
  EvolutionPolicyRule,
} from "./contracts";
import {
  createDefaultEvolutionPolicies,
} from "./policies";

export class EvolutionPolicyEngine {
  private readonly rules =
    new Map<string, EvolutionPolicyRule>();

  constructor(
    rules:
      readonly EvolutionPolicyRule[] =
      createDefaultEvolutionPolicies(),
  ) {
    for (const rule of rules) {
      this.register(rule);
    }
  }

  register(
    rule: EvolutionPolicyRule,
    replace = false,
  ): EvolutionPolicyRule {
    if (
      this.rules.has(rule.key) &&
      !replace
    ) {
      throw new Error(
        `Evolution policy already exists: ${rule.key}`,
      );
    }

    this.rules.set(
      rule.key,
      rule,
    );

    return rule;
  }

  evaluate(
    context: EvolutionPolicyContext,
  ): EvolutionPolicyDecision {
    const ruleResults =
      this.list()
        .filter((rule) =>
          rule.enabled,
        )
        .map((rule) =>
          rule.evaluate(context),
        );

    const blockingFailures =
      ruleResults.filter(
        (result) =>
          !result.passed &&
          result.blocking,
      );

    const controls =
      ruleResults.flatMap(
        (result) =>
          result.controls,
      );

    const decision =
      blockingFailures.length > 0
        ? EvolutionDecision.REJECT
        : controls.some(
              (control) =>
                control.mandatory,
            )
          ? EvolutionDecision.APPROVE_WITH_CONTROLS
          : EvolutionDecision.APPROVE;

    return {
      proposalId:
        context.proposal.id,
      decision,
      approved:
        decision !==
        EvolutionDecision.REJECT,
      ruleResults,
      controls:
        this.deduplicateControls(
          controls,
        ),
      reasons:
        ruleResults.map(
          (result) =>
            result.message,
        ),
      decidedAt:
        new Date().toISOString(),
    };
  }

  list(): EvolutionPolicyRule[] {
    return Array.from(
      this.rules.values(),
    ).sort(
      (left, right) =>
        left.priority -
        right.priority,
    );
  }

  private deduplicateControls(
    controls:
      Readonly<EvolutionPolicyDecision["controls"]>,
  ): EvolutionPolicyDecision["controls"] {
    const byKey =
      new Map(
        controls.map(
          (control) => [
            control.key,
            control,
          ],
        ),
      );

    return Array.from(
      byKey.values(),
    ).map((control) =>
      structuredClone(control),
    );
  }
}

