import {
  V4DomainInput,
  V4EventInsight,
  V4PolicyInsight,
  V4RiskSignal,
  V4RoleInsight,
  V4WorkflowInsight,
} from "./contracts";

export class V4EnterpriseIntelligence {
  inferWorkflows(
    domains: readonly V4DomainInput[],
  ): V4WorkflowInsight[] {
    return domains.map((domain) => ({
      key: `${domain.key}.lifecycle`,
      domainKey: domain.key,
      trigger: `${domain.key}.create.requested`,
      steps: [
        "validate-input",
        "evaluate-policies",
        "persist-entity",
        "publish-domain-event",
        "record-audit-evidence",
      ],
      outcome: `${domain.key}.created`,
    }));
  }

  inferRoles(
    domains: readonly V4DomainInput[],
  ): V4RoleInsight[] {
    const permissions = domains.flatMap((domain) => [
      `${domain.key}:read`,
      `${domain.key}:create`,
      `${domain.key}:update`,
      `${domain.key}:delete`,
    ]);

    return [
      {
        role: "platform-admin",
        permissions,
      },
      {
        role: "operator",
        permissions: permissions.filter(
          (permission) => !permission.endsWith(":delete"),
        ),
      },
      {
        role: "viewer",
        permissions: permissions.filter((permission) =>
          permission.endsWith(":read"),
        ),
      },
    ];
  }

  inferEvents(
    domains: readonly V4DomainInput[],
  ): V4EventInsight[] {
    return domains.flatMap((domain) => [
      {
        key: `${domain.key}.created`,
        domainKey: domain.key,
        type: "domain" as const,
        payloadFields: domain.fields.map((field) => field.name),
      },
      {
        key: `${domain.key}.updated`,
        domainKey: domain.key,
        type: "domain" as const,
        payloadFields: ["id", "changes"],
      },
      {
        key: `${domain.key}.audit-recorded`,
        domainKey: domain.key,
        type: "audit" as const,
        payloadFields: ["entityId", "actorId", "action", "timestamp"],
      },
    ]);
  }

  inferPolicies(
    domains: readonly V4DomainInput[],
  ): V4PolicyInsight[] {
    return domains.flatMap((domain) => {
      const policies: V4PolicyInsight[] = [
        {
          key: `${domain.key}.required-fields`,
          domainKey: domain.key,
          rule: "required fields must be present before persistence",
          enforcement: "deny",
        },
        {
          key: `${domain.key}.auditability`,
          domainKey: domain.key,
          rule: "mutating operations must produce audit evidence",
          enforcement: "deny",
        },
      ];

      if (domain.fields.some((field) => field.unique)) {
        policies.push({
          key: `${domain.key}.uniqueness`,
          domainKey: domain.key,
          rule: "unique fields must not conflict with existing records",
          enforcement: "deny",
        });
      }

      return policies;
    });
  }

  inferRisks(
    domains: readonly V4DomainInput[],
  ): V4RiskSignal[] {
    return domains.flatMap((domain) => {
      const risks: V4RiskSignal[] = [];

      if (
        domain.fields.some((field) =>
          ["amount", "price", "total", "budget"].includes(
            field.name.toLowerCase(),
          ),
        )
      ) {
        risks.push({
          key: `${domain.key}.financial-integrity`,
          domainKey: domain.key,
          severity: "high",
          recommendation:
            "add approval thresholds, immutable ledgers, and reconciliation",
        });
      }

      if (
        domain.fields.some((field) =>
          ["email", "phone", "name"].includes(field.name.toLowerCase()),
        )
      ) {
        risks.push({
          key: `${domain.key}.personal-data`,
          domainKey: domain.key,
          severity: "medium",
          recommendation:
            "apply field encryption, retention policy, and access logging",
        });
      }

      return risks;
    });
  }
}
