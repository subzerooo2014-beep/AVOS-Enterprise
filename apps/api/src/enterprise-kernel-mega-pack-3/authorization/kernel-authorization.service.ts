import { Injectable } from "@nestjs/common";
import {
  KernelAuthorizationDecision,
  KernelAuthorizationRequest,
  KernelPermission,
  KernelPolicy
} from "../enterprise-kernel-mega-pack-3.types";
import { KernelPrincipalRegistryService } from "./kernel-principal-registry.service";
import { KernelPermissionRegistryService } from "../permissions/kernel-permission-registry.service";
import { KernelPolicyRegistryService } from "../policies/kernel-policy-registry.service";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelAuthorizationService {
  private readonly requests =
    new Map<string, KernelAuthorizationRequest>();

  private readonly decisions =
    new Map<string, KernelAuthorizationDecision>();

  constructor(
    private readonly principals: KernelPrincipalRegistryService,
    private readonly permissions: KernelPermissionRegistryService,
    private readonly policies: KernelPolicyRegistryService,
    private readonly audit: KernelSecurityAuditService
  ) {}

  authorize(input: {
    principalId: string;
    resource: string;
    action: string;
    risk: KernelAuthorizationRequest["risk"];
    context?: Record<string, unknown>;
    correlationId: string;
  }) {
    const principal = this.principals.get(
      input.principalId
    );

    const request: KernelAuthorizationRequest = {
      id: `kernel-auth-request:${Date.now()}:${
        this.requests.size + 1
      }`,
      principalId: input.principalId,
      resource: input.resource,
      action: input.action,
      risk: input.risk,
      context: input.context ?? {},
      correlationId: input.correlationId,
      requestedAt: new Date().toISOString()
    };

    this.requests.set(request.id, request);

    const matchedPermissions =
      this.permissions.byPrincipal(principal.id)
        .filter((permission) =>
          this.matchesPermission(permission, request)
        );

    const matchedPolicies =
      this.policies.active().filter((policy) =>
        this.matchesPolicy(policy, principal, request)
      );

    const denyPermission =
      matchedPermissions.find(
        (permission) => permission.effect === "deny"
      );

    const allowPermission =
      matchedPermissions.find(
        (permission) => permission.effect === "allow"
      );

    const obligations: string[] = [];
    const reasons: string[] = [];

    let decision: KernelAuthorizationDecision["decision"] =
      "deny";

    if (!principal.active) {
      decision = "deny";
      reasons.push("Principal is inactive.");
    }
    else if (denyPermission) {
      decision = "deny";
      reasons.push(
        `Denied by permission ${denyPermission.id}.`
      );
    }
    else {
      const matchingRules = matchedPolicies.flatMap(
        (policy) =>
          policy.rules
            .filter((rule) =>
              this.matchesPolicyRule(rule, request)
            )
            .map((rule) => ({
              policy,
              rule
            }))
      );

      for (const match of matchingRules) {
        obligations.push(...match.rule.obligations);
      }

      const denyRule = matchingRules.find(
        (match) => match.rule.decision === "deny"
      );

      const approvalRule = matchingRules.find(
        (match) =>
          match.rule.decision === "require-approval"
      );

      const conditionalRule = matchingRules.find(
        (match) =>
          match.rule.decision === "allow-with-conditions"
      );

      if (denyRule) {
        decision = "deny";
        reasons.push(
          `Denied by policy ${denyRule.policy.id}.`
        );
      }
      else if (approvalRule) {
        decision = "require-approval";
        reasons.push(
          `Human approval required by policy ${approvalRule.policy.id}.`
        );
      }
      else if (conditionalRule && allowPermission) {
        decision = "allow-with-conditions";
        reasons.push(
          `Allowed with conditions by policy ${conditionalRule.policy.id}.`
        );
      }
      else if (allowPermission) {
        decision = "allow";
        reasons.push(
          `Allowed by permission ${allowPermission.id}.`
        );
      }
      else {
        decision = "deny";
        reasons.push(
          "No matching allow permission."
        );
      }
    }

    const allowed =
      decision === "allow" ||
      decision === "allow-with-conditions";

    const authorizationDecision: KernelAuthorizationDecision = {
      id: `kernel-auth-decision:${Date.now()}:${
        this.decisions.size + 1
      }`,
      requestId: request.id,
      principalId: request.principalId,
      resource: request.resource,
      action: request.action,
      decision,
      allowed,
      requiresHumanApproval:
        decision === "require-approval",
      matchedPermissionIds:
        matchedPermissions.map(
          (permission) => permission.id
        ),
      matchedPolicyIds:
        matchedPolicies.map(
          (policy) => policy.id
        ),
      obligations:
        Array.from(new Set(obligations)),
      reasons,
      decidedAt: new Date().toISOString()
    };

    this.decisions.set(
      authorizationDecision.id,
      authorizationDecision
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "authorization",
      action: "kernel-authorization-decided",
      subjectId: authorizationDecision.id,
      actorIdentityId: principal.id,
      outcome:
        authorizationDecision.allowed
          ? "success"
          : authorizationDecision.requiresHumanApproval
            ? "warning"
            : "blocked",
      metadata: {
        decision: authorizationDecision.decision,
        resource: authorizationDecision.resource,
        action: authorizationDecision.action
      }
    });

    return authorizationDecision;
  }

  getDecision(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new Error(
        `Kernel authorization decision not found: ${id}`
      );
    }

    return decision;
  }

  listDecisions() {
    return Array.from(this.decisions.values());
  }

  summary() {
    const decisions = this.listDecisions();

    return {
      total: decisions.length,
      allowed: decisions.filter(
        (decision) => decision.allowed
      ).length,
      approvalRequired: decisions.filter(
        (decision) =>
          decision.requiresHumanApproval
      ).length,
      denied: decisions.filter(
        (decision) =>
          decision.decision === "deny"
      ).length
    };
  }

  private matchesPermission(
    permission: KernelPermission,
    request: KernelAuthorizationRequest
  ) {
    const resourceMatch =
      permission.resource === "*" ||
      permission.resource === request.resource ||
      (
        permission.resource.endsWith("*") &&
        request.resource.startsWith(
          permission.resource.slice(0, -1)
        )
      );

    const actionMatch =
      permission.action === "*" ||
      permission.action === request.action;

    return (
      resourceMatch &&
      actionMatch &&
      this.matchesConditions(
        permission.conditions,
        request.context
      )
    );
  }

  private matchesPolicy(
    policy: KernelPolicy,
    principal: ReturnType<
      KernelPrincipalRegistryService["get"]
    >,
    request: KernelAuthorizationRequest
  ) {
    const scopeMatch = policy.scope.some(
      (scope) =>
        scope === "*" ||
        scope === request.resource ||
        (
          scope.endsWith("*") &&
          request.resource.startsWith(
            scope.slice(0, -1)
          )
        )
    );

    return (
      scopeMatch &&
      principal.active
    );
  }

  private matchesPolicyRule(
    rule: KernelPolicy["rules"][number],
    request: KernelAuthorizationRequest
  ) {
    const resourceMatch =
      rule.resource === "*" ||
      rule.resource === request.resource ||
      (
        rule.resource.endsWith("*") &&
        request.resource.startsWith(
          rule.resource.slice(0, -1)
        )
      );

    const actionMatch =
      rule.action === "*" ||
      rule.action === request.action;

    const riskMatch =
      !rule.riskThreshold ||
      this.riskLevel(request.risk) >=
      this.riskLevel(rule.riskThreshold);

    return (
      resourceMatch &&
      actionMatch &&
      riskMatch &&
      this.matchesConditions(
        rule.conditions,
        {
          ...request.context,
          "principal.active": true
        }
      )
    );
  }

  private matchesConditions(
    conditions: Array<{
      key: string;
      operator:
        | "equals"
        | "not-equals"
        | "contains"
        | "one-of"
        | "exists";
      value?: unknown;
    }>,
    context: Record<string, unknown>
  ) {
    return conditions.every((condition) => {
      const current = context[condition.key];

      switch (condition.operator) {
        case "equals":
          return current === condition.value;
        case "not-equals":
          return current !== condition.value;
        case "contains":
          return Array.isArray(current)
            ? current.includes(condition.value)
            : String(current ?? "").includes(
                String(condition.value ?? "")
              );
        case "one-of":
          return Array.isArray(condition.value)
            ? condition.value.includes(current)
            : false;
        case "exists":
          return current !== undefined && current !== null;
      }
    });
  }

  private riskLevel(
    risk: KernelAuthorizationRequest["risk"]
  ) {
    const levels = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };

    return levels[risk];
  }
}
