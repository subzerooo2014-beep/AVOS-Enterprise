import { Injectable } from "@nestjs/common";
import { BrainAgentGovernancePolicy } from "../enterprise-brain-mega-pack-5.types";
import { BrainMultiAgentAuditService } from "../observability/brain-multi-agent-audit.service";

@Injectable()
export class BrainAgentGovernanceService {
  private readonly policies =
    new Map<string, BrainAgentGovernancePolicy>();

  constructor(
    private readonly audit: BrainMultiAgentAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.policies.values());
  }

  assess(input: {
    subjectId: string;
    checks: Record<string, boolean>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const activePolicies = this.list().filter((policy) => policy.active);
    const passed: string[] = [];
    const failed: string[] = [];

    for (const policy of activePolicies) {
      const ok = policy.checks.every(
        (check) => input.checks[check] === true
      );

      if (ok) passed.push(policy.id);
      else failed.push(policy.id);
    }

    const mandatoryFailed = activePolicies.some(
      (policy) =>
        policy.mandatory &&
        failed.includes(policy.id)
    );

    const score =
      activePolicies.length === 0
        ? 100
        : Number(
            (
              passed.length /
              activePolicies.length *
              100
            ).toFixed(2)
          );

    const result = {
      subjectId: input.subjectId,
      allowed: !mandatoryFailed,
      score,
      passed,
      failed,
      assessedAt: new Date().toISOString()
    };

    this.audit.record({
      correlationId: input.correlationId,
      category: "governance",
      action: "brain-agent-governance-assessed",
      subjectId: input.subjectId,
      actorIdentityId: input.actorIdentityId,
      outcome:
        result.allowed
          ? failed.length > 0
            ? "warning"
            : "success"
          : "blocked",
      metadata: {
        score,
        failed
      }
    });

    return result;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      mandatory: items.filter((x) => x.mandatory).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const policies: BrainAgentGovernancePolicy[] = [
      {
        id: "brain-agent-policy:capability-match",
        name: "Capability Match",
        description: "Agents must match required capabilities.",
        mandatory: true,
        active: true,
        checks: ["capabilityMatch"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-agent-policy:permission-match",
        name: "Permission Match",
        description: "Agents must have required permissions.",
        mandatory: true,
        active: true,
        checks: ["permissionMatch"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-agent-policy:human-authority",
        name: "Human Final Authority",
        description: "Critical agent actions require human approval.",
        mandatory: true,
        active: true,
        checks: ["humanFinalAuthorityPreserved"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-agent-policy:traceability",
        name: "Traceability",
        description: "Agent activity must remain traceable.",
        mandatory: true,
        active: true,
        checks: ["traceabilityActive"],
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const policy of policies) {
      this.policies.set(policy.id, policy);
    }
  }
}
