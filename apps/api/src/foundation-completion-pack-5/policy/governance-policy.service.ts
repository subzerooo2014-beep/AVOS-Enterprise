import { Injectable, NotFoundException } from "@nestjs/common";
import { GovernancePolicy } from "../foundation-pack-5.types";

@Injectable()
export class GovernancePolicyService {
  private readonly policies = new Map<string, GovernancePolicy>([
    [
      "policy:foundation-first:1.0.0",
      {
        id: "policy:foundation-first:1.0.0",
        code: "AVOS-FOUNDATION-FIRST",
        name: "Foundation First",
        description:
          "Core foundations must be completed and validated before higher-layer expansion.",
        version: "1.0.0",
        status: "active",
        scope: ["foundation", "capability", "product", "venture"],
        rules: [
          "No higher-layer capability may bypass foundation validation.",
          "Every new capability must strengthen reusable platform assets."
        ],
        owners: {
          businessOwner: "AVOS Foundation",
          technicalOwner: "AVOS Platform Engineering",
          governanceOwner: "AVOS Governance OS",
          approverIdentityIds: ["identity:avos-platform"]
        },
        requiresHumanApproval: true,
        effectiveFrom: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    [
      "policy:human-authority:1.0.0",
      {
        id: "policy:human-authority:1.0.0",
        code: "AVOS-HUMAN-AUTHORITY",
        name: "Human Authority",
        description:
          "The human remains the final authority for high-risk and strategic decisions.",
        version: "1.0.0",
        status: "active",
        scope: ["decision", "automation", "orchestration", "risk"],
        rules: [
          "Critical decisions require human approval.",
          "Autonomous execution must remain traceable and reversible."
        ],
        owners: {
          businessOwner: "AVOS Foundation",
          technicalOwner: "AVOS Platform Engineering",
          governanceOwner: "AVOS Governance OS",
          approverIdentityIds: ["identity:avos-platform"]
        },
        requiresHumanApproval: true,
        effectiveFrom: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  ]);

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(`Governance policy not found: ${id}`);
    }

    return policy;
  }

  register(input: Omit<GovernancePolicy, "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();

    const policy: GovernancePolicy = {
      ...input,
      scope: Array.from(new Set(input.scope)),
      rules: Array.from(new Set(input.rules)),
      owners: {
        ...input.owners,
        approverIdentityIds: Array.from(
          new Set(input.owners.approverIdentityIds)
        )
      },
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);
    return policy;
  }

  versions(code: string) {
    return this.list()
      .filter((policy) => policy.code === code)
      .sort((left, right) => left.version.localeCompare(right.version));
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter((policy) => policy.status === "active").length,
      humanApprovalRequired: policies.filter(
        (policy) => policy.requiresHumanApproval
      ).length
    };
  }
}
