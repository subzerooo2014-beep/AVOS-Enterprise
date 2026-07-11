import { Injectable } from "@nestjs/common";
import { AuditSeverity } from "../enums/audit-severity.enum";
import { PolicyDecision } from "../enums/policy-decision.enum";
import { PolicyEnforcementMode } from "../enums/policy-enforcement-mode.enum";
import { RiskLevel } from "../enums/risk-level.enum";
import { PolicyEvaluation } from "../interfaces/policy-evaluation.interface";
import { RuntimePolicy } from "../interfaces/runtime-policy.interface";

@Injectable()
export class RuntimePolicyEngineService {
  private mode =
    this.readMode(
      process.env.AVOS_POLICY_ENFORCEMENT_MODE,
    );

  private readonly policies =
    new Map<string, RuntimePolicy>();

  constructor() {
    this.seedPolicies();
  }

  evaluate(input: {
    method: string;
    path: string;
    approvalToken?: string;
    environment?: string;
  }): PolicyEvaluation {
    const method =
      input.method.toUpperCase();

    const path =
      input.path.split("?")[0];

    const environment =
      input.environment ??
      process.env.NODE_ENV ??
      "development";

    const matchedPolicies =
      Array.from(this.policies.values())
        .filter((policy) => {
          if (!policy.enabled) {
            return false;
          }

          const methodMatched =
            policy.methods.includes(method) ||
            policy.methods.includes("*");

          const pathMatched =
            policy.pathPrefixes.some(
              (prefix) =>
                path === prefix ||
                path.startsWith(
                  `${prefix}/`,
                ),
            );

          return methodMatched && pathMatched;
        });

    if (matchedPolicies.length === 0) {
      return {
        decision: PolicyDecision.ALLOW,
        riskLevel: RiskLevel.LOW,
        riskScore: 0,
        matchedPolicyIds: [],
        reasons: [],
        approvalRequired: false,
        evaluatedAt:
          new Date().toISOString(),
      };
    }

    const reasons: string[] = [];
    let riskScore = 0;
    let approvalRequired = false;
    let deny = false;

    for (const policy of matchedPolicies) {
      riskScore += this.severityScore(
        policy.severity,
      );

      if (policy.requireApprovalToken) {
        approvalRequired = true;

        const expected =
          process.env.AVOS_POLICY_APPROVAL_TOKEN ??
          "avos-dev-policy-approval";

        if (
          !input.approvalToken ||
          input.approvalToken !== expected
        ) {
          reasons.push(
            `${policy.name}: approval token is required`,
          );

          deny = true;
        }
      }

      if (
        policy.blockInProduction &&
        environment === "production"
      ) {
        reasons.push(
          `${policy.name}: blocked in production`,
        );

        deny = true;
      }
    }

    riskScore = Math.min(100, riskScore);

    const riskLevel =
      this.calculateRiskLevel(riskScore);

    let decision: PolicyDecision;

    if (
      deny &&
      this.mode ===
        PolicyEnforcementMode.ENFORCE
    ) {
      decision = PolicyDecision.DENY;
    } else if (deny) {
      decision =
        PolicyDecision.ALLOW_WITH_WARNING;
    } else {
      decision = PolicyDecision.ALLOW;
    }

    return {
      decision,
      riskLevel,
      riskScore,
      matchedPolicyIds:
        matchedPolicies.map(
          (policy) => policy.id,
        ),
      reasons,
      approvalRequired,
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  getMode(): PolicyEnforcementMode {
    return this.mode;
  }

  setMode(
    mode: PolicyEnforcementMode,
  ): PolicyEnforcementMode {
    this.mode = mode;
    return this.mode;
  }

  findAll(): RuntimePolicy[] {
    return Array.from(
      this.policies.values(),
    )
      .map((policy) => ({
        ...policy,
        methods: [...policy.methods],
        pathPrefixes: [
          ...policy.pathPrefixes,
        ],
      }))
      .sort((a, b) =>
        a.name.localeCompare(b.name),
      );
  }

  setEnabled(
    id: string,
    enabled: boolean,
  ): RuntimePolicy | null {
    const policy =
      this.policies.get(id);

    if (!policy) {
      return null;
    }

    policy.enabled = enabled;
    policy.updatedAt =
      new Date().toISOString();

    this.policies.set(id, policy);

    return {
      ...policy,
      methods: [...policy.methods],
      pathPrefixes: [
        ...policy.pathPrefixes,
      ],
    };
  }

  getSecurityRiskSummary() {
    const enabledPolicies =
      this.findAll().filter(
        (item) => item.enabled,
      );

    const maximumRiskScore =
      enabledPolicies.reduce(
        (highest, policy) =>
          Math.max(
            highest,
            this.severityScore(
              policy.severity,
            ),
          ),
        0,
      );

    return {
      enforcementMode: this.mode,
      totalPolicies: this.policies.size,
      enabledPolicies:
        enabledPolicies.length,
      disabledPolicies:
        this.policies.size -
        enabledPolicies.length,
      maximumConfiguredRiskLevel:
        this.calculateRiskLevel(
          maximumRiskScore,
        ),
    };
  }

  private seedPolicies(): void {
    const timestamp =
      new Date().toISOString();

    const defaults: RuntimePolicy[] = [
      {
        id: "protect-user-deletion",
        name: "Protect User Deletion",
        description:
          "Requires explicit approval before deleting users",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/users"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity:
          AuditSeverity.CRITICAL,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "protect-customer-deletion",
        name: "Protect Customer Deletion",
        description:
          "Requires explicit approval before deleting customers",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/customers"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity:
          AuditSeverity.ERROR,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "protect-vehicle-deletion",
        name: "Protect Vehicle Deletion",
        description:
          "Requires explicit approval before deleting vehicles",
        enabled: true,
        methods: ["DELETE"],
        pathPrefixes: ["/vehicles"],
        requireApprovalToken: true,
        blockInProduction: false,
        severity:
          AuditSeverity.ERROR,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "protect-system-configuration",
        name: "Protect System Configuration",
        description:
          "Requires approval for sensitive configuration changes",
        enabled: true,
        methods: ["POST", "PUT", "PATCH"],
        pathPrefixes: [
          "/platform-hardening",
          "/system-config",
          "/settings/security",
        ],
        requireApprovalToken: true,
        blockInProduction: false,
        severity:
          AuditSeverity.CRITICAL,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: "block-development-reset",
        name: "Block Development Reset",
        description:
          "Blocks reset endpoints in production",
        enabled: true,
        methods: ["POST", "DELETE"],
        pathPrefixes: [
          "/dev/reset",
          "/test/reset",
          "/seed/reset",
        ],
        requireApprovalToken: false,
        blockInProduction: true,
        severity:
          AuditSeverity.CRITICAL,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];

    for (const policy of defaults) {
      this.policies.set(
        policy.id,
        policy,
      );
    }
  }

  private severityScore(
    severity: AuditSeverity,
  ): number {
    switch (severity) {
      case AuditSeverity.INFO:
        return 10;
      case AuditSeverity.WARNING:
        return 30;
      case AuditSeverity.ERROR:
        return 60;
      case AuditSeverity.CRITICAL:
        return 90;
      default:
        return 0;
    }
  }

  private calculateRiskLevel(
    score: number,
  ): RiskLevel {
    if (score >= 80) {
      return RiskLevel.CRITICAL;
    }

    if (score >= 50) {
      return RiskLevel.HIGH;
    }

    if (score >= 20) {
      return RiskLevel.MEDIUM;
    }

    return RiskLevel.LOW;
  }

  private readMode(
    value: string | undefined,
  ): PolicyEnforcementMode {
    if (
      value ===
      PolicyEnforcementMode.ENFORCE
    ) {
      return PolicyEnforcementMode.ENFORCE;
    }

    return PolicyEnforcementMode.AUDIT_ONLY;
  }
}
