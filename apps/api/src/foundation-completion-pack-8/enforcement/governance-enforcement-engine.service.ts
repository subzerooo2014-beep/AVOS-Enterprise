import { Injectable } from "@nestjs/common";
import {
  EnforcementDecision,
  GovernancePolicyRule,
  GovernanceScope
} from "../foundation-pack-8.types";
import { GovernancePolicyRegistryService } from "../policies/governance-policy-registry.service";
import { GovernanceExceptionService } from "../exceptions/governance-exception.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernanceEnforcementEngineService {
  private readonly decisions =
    new Map<string, EnforcementDecision>();

  constructor(
    private readonly policies: GovernancePolicyRegistryService,
    private readonly exceptions: GovernanceExceptionService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  evaluate(input: {
    subjectId: string;
    subjectType: GovernanceScope;
    correlationId: string;
    action: string;
    context: Record<string, unknown>;
    evaluatedByIdentityId: string;
  }) {
    const policies = this.policies.activeForScope(
      input.subjectType
    );

    const matchedPolicyIds: string[] = [];
    const failedRuleIds: string[] = [];
    const warnings: string[] = [];
    const reasons: string[] = [];
    let blocked = false;
    let requiresHumanApproval = false;

    for (const policy of policies) {
      matchedPolicyIds.push(policy.id);

      if (policy.requiresHumanApproval) {
        requiresHumanApproval = true;
      }

      const exceptionActive = this.exceptions.validFor(
        input.subjectId,
        policy.id
      );

      for (const rule of policy.rules) {
        const passed = this.evaluateRule(rule, input.context);

        if (passed) {
          continue;
        }

        if (exceptionActive) {
          warnings.push(
            `Policy ${policy.id} rule ${rule.id} bypassed by approved exception.`
          );
          continue;
        }

        failedRuleIds.push(rule.id);
        reasons.push(rule.message);

        if (rule.effect === "deny" || rule.effect === "require") {
          blocked = true;
        }
        else if (rule.effect === "warn") {
          warnings.push(rule.message);
        }
      }
    }

    const status: EnforcementDecision["status"] =
      blocked
        ? "blocked"
        : requiresHumanApproval
          ? "pending-human-review"
          : warnings.length > 0
            ? "warning"
            : "passed";

    const decision: EnforcementDecision = {
      id: `enforcement-decision:${Date.now()}:${
        this.decisions.size + 1
      }`,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      correlationId: input.correlationId,
      action: input.action,
      status,
      matchedPolicyIds,
      failedRuleIds,
      warnings,
      reasons,
      requiresHumanApproval,
      evaluatedByIdentityId: input.evaluatedByIdentityId,
      evaluatedAt: new Date().toISOString()
    };

    this.decisions.set(decision.id, decision);

    this.audit.record({
      correlationId: input.correlationId,
      category: "enforcement",
      action: "governance-evaluated",
      subjectId: decision.id,
      actorIdentityId: input.evaluatedByIdentityId,
      outcome:
        status === "blocked"
          ? "blocked"
          : status === "warning" ||
              status === "pending-human-review"
            ? "warning"
            : "success",
      metadata: {
        subjectId: input.subjectId,
        action: input.action,
        matchedPolicyIds,
        failedRuleIds,
        status
      }
    });

    return decision;
  }

  bySubject(subjectId: string) {
    return this.list().filter(
      (decision) => decision.subjectId === subjectId
    );
  }

  summary() {
    const decisions = this.list();

    return {
      total: decisions.length,
      passed: decisions.filter(
        (item) => item.status === "passed"
      ).length,
      blocked: decisions.filter(
        (item) => item.status === "blocked"
      ).length,
      warnings: decisions.filter(
        (item) => item.status === "warning"
      ).length,
      pendingHumanReview: decisions.filter(
        (item) => item.status === "pending-human-review"
      ).length
    };
  }

  private evaluateRule(
    rule: GovernancePolicyRule,
    context: Record<string, unknown>
  ) {
    const actual = context[rule.field];

    switch (rule.operator) {
      case "equals":
        return actual === rule.value;
      case "not-equals":
        return actual !== rule.value;
      case "contains":
        return Array.isArray(actual)
          ? actual.includes(rule.value)
          : String(actual ?? "").includes(String(rule.value ?? ""));
      case "not-contains":
        return Array.isArray(actual)
          ? !actual.includes(rule.value)
          : !String(actual ?? "").includes(String(rule.value ?? ""));
      case "greater-than":
        return Number(actual) > Number(rule.value);
      case "greater-than-or-equal":
        return Number(actual) >= Number(rule.value);
      case "less-than":
        return Number(actual) < Number(rule.value);
      case "less-than-or-equal":
        return Number(actual) <= Number(rule.value);
      case "exists":
        return actual !== undefined && actual !== null;
      case "not-exists":
        return actual === undefined || actual === null;
      case "in":
        return Array.isArray(rule.value)
          ? rule.value.includes(actual)
          : false;
      default:
        return false;
    }
  }
}
