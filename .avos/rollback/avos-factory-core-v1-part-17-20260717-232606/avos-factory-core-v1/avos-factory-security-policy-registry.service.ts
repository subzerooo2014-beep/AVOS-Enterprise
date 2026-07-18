import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactorySecurityPolicy
} from "./avos-factory-security.contracts";

@Injectable()
export class AvosFactorySecurityPolicyRegistryService {
  private readonly policies: AvosFactorySecurityPolicy[] = [];

  constructor() {
    this.seedDefaults();
  }

  register(
    input: Omit<AvosFactorySecurityPolicy, "id" | "createdAt">
  ): AvosFactorySecurityPolicy {
    const existing = this.policies.find(
      (policy) =>
        policy.name.toLowerCase() === input.name.toLowerCase()
    );

    if (existing) {
      return structuredClone(existing);
    }

    const policy: AvosFactorySecurityPolicy = {
      id: randomUUID(),
      ...input,
      priority: Math.max(0, Math.round(input.priority)),
      createdAt: new Date().toISOString()
    };

    this.policies.push(policy);
    this.policies.sort((left, right) => right.priority - left.priority);

    return structuredClone(policy);
  }

  list(enabledOnly = false): AvosFactorySecurityPolicy[] {
    return this.policies
      .filter((policy) => !enabledOnly || policy.enabled)
      .map((policy) => structuredClone(policy));
  }

  get(policyId: string): AvosFactorySecurityPolicy | undefined {
    const policy = this.policies.find(
      (candidate) => candidate.id === policyId
    );

    return policy ? structuredClone(policy) : undefined;
  }

  private seedDefaults(): void {
    const defaults: Array<
      Omit<AvosFactorySecurityPolicy, "id" | "createdAt">
    > = [
      {
        name: "Deny destructive production actions",
        description: "Destructive production operations are blocked by default.",
        resourceType: "factory-project",
        action: "destroy",
        effect: "deny",
        priority: 100,
        enabled: true,
        conditions: { environment: "production" },
        requiresHumanApproval: false
      },
      {
        name: "Require approval for production generation",
        description: "Production generation requires Human Final Authority.",
        resourceType: "factory-project",
        action: "generate",
        effect: "require-approval",
        priority: 90,
        enabled: true,
        conditions: { environment: "production" },
        requiresHumanApproval: true
      },
      {
        name: "Allow governed validation",
        description: "Governed validation is allowed.",
        resourceType: "factory-project",
        action: "validate",
        effect: "allow",
        priority: 50,
        enabled: true,
        conditions: {},
        requiresHumanApproval: false
      },
      {
        name: "Allow governed security assessment",
        description: "Security assessments are allowed.",
        resourceType: "factory-project",
        action: "security-assess",
        effect: "allow",
        priority: 50,
        enabled: true,
        conditions: {},
        requiresHumanApproval: false
      }
    ];

    for (const policy of defaults) {
      this.register(policy);
    }
  }
}
