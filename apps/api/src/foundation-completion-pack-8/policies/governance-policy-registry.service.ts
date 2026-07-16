import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GovernancePolicy,
  GovernancePolicyStatus,
  GovernanceScope
} from "../foundation-pack-8.types";
import { DigitalConstitutionService } from "../constitution/digital-constitution.service";
import { GovernanceStandardRegistryService } from "../standards/governance-standard-registry.service";
import { GovernanceAuditService } from "../observability/governance-audit.service";

@Injectable()
export class GovernancePolicyRegistryService {
  private readonly policies = new Map<string, GovernancePolicy>();

  constructor(
    private readonly constitution: DigitalConstitutionService,
    private readonly standards: GovernanceStandardRegistryService,
    private readonly audit: GovernanceAuditService
  ) {}

  list() {
    return Array.from(this.policies.values()).sort(
      (left, right) => right.priority - left.priority
    );
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(
        `Governance policy not found: ${id}`
      );
    }

    return policy;
  }

  register(
    input: Omit<GovernancePolicy, "createdAt" | "updatedAt">,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    for (const principleId of input.principleIds) {
      this.constitution.get(principleId);
    }

    for (const standardId of input.standardIds) {
      this.standards.get(standardId);
    }

    const now = new Date().toISOString();

    const policy: GovernancePolicy = {
      ...input,
      principleIds: Array.from(new Set(input.principleIds)),
      standardIds: Array.from(new Set(input.standardIds)),
      rules: input.rules.map((rule) => ({ ...rule })),
      priority: Math.round(input.priority),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        scope: policy.scope,
        status: policy.status,
        version: policy.version
      }
    });

    return policy;
  }

  updateStatus(
    id: string,
    status: GovernancePolicyStatus,
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(id);

    const updated: GovernancePolicy = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.policies.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: `policy-status:${status}`,
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {}
    });

    return updated;
  }

  activeForScope(scope: GovernanceScope) {
    const now = Date.now();

    return this.list().filter((policy) => {
      if (policy.status !== "active") {
        return false;
      }

      if (policy.scope !== scope && policy.scope !== "platform") {
        return false;
      }

      if (
        policy.effectiveFrom &&
        new Date(policy.effectiveFrom).getTime() > now
      ) {
        return false;
      }

      if (
        policy.effectiveUntil &&
        new Date(policy.effectiveUntil).getTime() < now
      ) {
        return false;
      }

      return true;
    });
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter((item) => item.status === "active").length,
      review: policies.filter((item) => item.status === "review").length,
      requiresHumanApproval: policies.filter(
        (item) => item.requiresHumanApproval
      ).length
    };
  }
}
