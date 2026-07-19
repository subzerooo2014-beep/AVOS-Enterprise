import { Injectable } from "@nestjs/common";
import {
  AuthorizationPolicy,
  SecurityDecision,
} from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";
import { SecurityAuditService } from "./security-audit.service";

@Injectable()
export class AuthorizationPoliciesService {
  constructor(
    private readonly store: PlatformSecurityFileStoreService,
    private readonly audit: SecurityAuditService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const defaults = [
      {
        name: "Platform Runtime Health Access",
        subjectPattern: "unified-platform-runtime",
        resourcePattern: "platform-health",
        actions: ["read", "write"],
        environments: ["production"],
        decision: "allow" as SecurityDecision,
        priority: 100,
        active: true,
        humanApprovalRequired: false,
      },
      {
        name: "Service Mesh Routing Access",
        subjectPattern: "enterprise-service-mesh",
        resourcePattern: "service-routing",
        actions: ["read", "route"],
        environments: ["production"],
        decision: "allow" as SecurityDecision,
        priority: 100,
        active: true,
        humanApprovalRequired: false,
      },
      {
        name: "Event Mesh Publishing Access",
        subjectPattern: "platform-event-mesh",
        resourcePattern: "event-streams",
        actions: ["publish", "consume"],
        environments: ["production"],
        decision: "allow" as SecurityDecision,
        priority: 100,
        active: true,
        humanApprovalRequired: false,
      },
      {
        name: "Default Deny",
        subjectPattern: "*",
        resourcePattern: "*",
        actions: ["*"],
        environments: ["development", "test", "staging", "production"],
        decision: "deny" as SecurityDecision,
        priority: 1,
        active: true,
        humanApprovalRequired: false,
      },
    ];

    for (const policy of defaults) {
      this.register(policy, "human:khalifa");
    }
  }

  register(
    input: Omit<AuthorizationPolicy, "id" | "createdAt">,
    approvedBy: string,
  ): AuthorizationPolicy {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Policy registration requires Human Final Authority.");
    }

    const existing = this.list().find((item) => item.name === input.name);

    if (existing) {
      return existing;
    }

    const policy: AuthorizationPolicy = {
      ...input,
      id: this.id("authorization-policy"),
      createdAt: this.now(),
    };

    this.store.writeJson(`policies/${policy.id}.json`, policy);
    this.audit.record({
      category: "authorization",
      action: "register-policy",
      actor: approvedBy,
      subject: policy.id,
      outcome: "success",
      metadata: { name: policy.name },
    });

    return policy;
  }

  list(): AuthorizationPolicy[] {
    return this.store.listJson<AuthorizationPolicy>("policies");
  }

  evaluate(input: {
    subject: string;
    resource: string;
    action: string;
    environment: string;
  }): {
    decision: SecurityDecision;
    policyId?: string;
    reason: string;
  } {
    const matches = this.list()
      .filter((policy) => policy.active)
      .filter(
        (policy) =>
          (policy.subjectPattern === "*" ||
            policy.subjectPattern === input.subject) &&
          (policy.resourcePattern === "*" ||
            policy.resourcePattern === input.resource) &&
          (policy.actions.includes("*") ||
            policy.actions.includes(input.action)) &&
          policy.environments.includes(input.environment),
      )
      .sort((a, b) => b.priority - a.priority);

    const selected = matches[0];

    if (!selected) {
      return {
        decision: "deny",
        reason: "No matching policy. Default deny applied.",
      };
    }

    return {
      decision: selected.decision,
      policyId: selected.id,
      reason: `Matched policy: ${selected.name}`,
    };
  }
}