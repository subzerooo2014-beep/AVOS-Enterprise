import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelPolicy } from "../enterprise-kernel-mega-pack-3.types";
import { KernelSecurityAuditService } from "../observability/kernel-security-audit.service";

@Injectable()
export class KernelPolicyRegistryService {
  private readonly policies =
    new Map<string, KernelPolicy>();

  constructor(
    private readonly audit: KernelSecurityAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(
        `Kernel policy not found: ${id}`
      );
    }

    return policy;
  }

  register(
    input: Omit<KernelPolicy, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.policies.has(input.id)) {
      throw new ConflictException(
        `Kernel policy already exists: ${input.id}`
      );
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(
        `Kernel policy version is invalid: ${input.version}`
      );
    }

    const now = new Date().toISOString();

    const policy: KernelPolicy = {
      ...input,
      scope: Array.from(new Set(input.scope)),
      rules: input.rules.map((rule) => ({
        ...rule,
        obligations: Array.from(
          new Set(rule.obligations)
        ),
        conditions: rule.conditions.map(
          (condition) => ({ ...condition })
        )
      })),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "kernel-policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: policy.version,
        scope: policy.scope
      }
    });

    return policy;
  }

  active() {
    return this.list()
      .filter((policy) => policy.active)
      .sort((left, right) => right.priority - left.priority);
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter(
        (policy) => policy.active
      ).length,
      rules: policies.reduce(
        (sum, policy) => sum + policy.rules.length,
        0
      )
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const policies: KernelPolicy[] = [
      {
        id: "kernel-policy:critical-human-approval",
        name: "Critical Human Approval",
        description:
          "Critical kernel operations require explicit human approval.",
        version: "1.0.0",
        scope: ["kernel:*"],
        priority: 1000,
        active: true,
        rules: [
          {
            id: "critical-human-approval-rule",
            resource: "kernel:*",
            action: "*",
            decision: "require-approval",
            riskThreshold: "critical",
            conditions: [],
            obligations: [
              "record-audit",
              "require-human-approval",
              "preserve-compensation-plan"
            ]
          }
        ],
        metadata: {
          trustFramework: true,
          governanceOS: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-policy:high-risk-controlled",
        name: "High Risk Controlled Execution",
        description:
          "High risk kernel operations require conditions and traceability.",
        version: "1.0.0",
        scope: ["kernel:*"],
        priority: 900,
        active: true,
        rules: [
          {
            id: "high-risk-controlled-rule",
            resource: "kernel:*",
            action: "*",
            decision: "allow-with-conditions",
            riskThreshold: "high",
            conditions: [],
            obligations: [
              "record-audit",
              "record-trace",
              "require-reversible-execution"
            ]
          }
        ],
        metadata: {},
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-policy:deny-unknown-principals",
        name: "Deny Unknown Principals",
        description:
          "Unknown or inactive principals are denied.",
        version: "1.0.0",
        scope: ["kernel:*"],
        priority: 1100,
        active: true,
        rules: [
          {
            id: "deny-unknown-principal-rule",
            resource: "kernel:*",
            action: "*",
            decision: "deny",
            conditions: [
              {
                key: "principal.active",
                operator: "equals",
                value: false
              }
            ],
            obligations: ["record-audit"]
          }
        ],
        metadata: {},
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const policy of policies) {
      this.policies.set(policy.id, policy);
    }
  }
}
