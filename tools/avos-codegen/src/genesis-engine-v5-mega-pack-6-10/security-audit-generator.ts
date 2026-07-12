import { V5SecurityInput } from "./contracts";

export interface V5SecurityAuditEvent {
  key: string;
  severity: "info" | "warning" | "critical";
  requiredFields: string[];
  retentionDays: number;
}

export interface V5SecurityTestPlan {
  tenantIsolationTests: string[];
  authorizationTests: string[];
  zeroTrustTests: string[];
  quotaTests: string[];
}

export class V5SecurityAuditGenerator {
  events(input: V5SecurityInput): V5SecurityAuditEvent[] {
    const base: V5SecurityAuditEvent[] = [
      {
        key: "security.access.allowed",
        severity: "info",
        requiredFields: [
          "tenantId",
          "subjectId",
          "resource",
          "action",
          "decisionId",
        ],
        retentionDays: 365,
      },
      {
        key: "security.access.denied",
        severity: "warning",
        requiredFields: [
          "tenantId",
          "subjectId",
          "resource",
          "action",
          "reason",
        ],
        retentionDays: 730,
      },
      {
        key: "security.cross-tenant-attempt",
        severity: "critical",
        requiredFields: [
          "sourceTenantId",
          "targetTenantId",
          "subjectId",
          "resource",
        ],
        retentionDays: 2555,
      },
    ];

    if (input.domains.some((domain) => domain.sensitiveFields?.length)) {
      base.push({
        key: "security.sensitive-field-access",
        severity: "warning",
        requiredFields: [
          "tenantId",
          "subjectId",
          "domain",
          "fields",
        ],
        retentionDays: 730,
      });
    }

    return base;
  }

  tests(): V5SecurityTestPlan {
    return {
      tenantIsolationTests: [
        "tenant cannot read another tenant records",
        "tenant cannot mutate another tenant records",
        "tenant routing cannot be bypassed",
      ],
      authorizationTests: [
        "unknown role is denied",
        "missing permission is denied",
        "valid role permission is allowed",
      ],
      zeroTrustTests: [
        "missing workload identity is denied",
        "expired service credential is denied",
        "undeclared service call is denied",
      ],
      quotaTests: [
        "tenant limit is enforced",
        "user mutation limit is enforced",
        "service event burst is throttled",
      ],
    };
  }
}
