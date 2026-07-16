import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { MeshCommunicationPolicy } from "../enterprise-nervous-system-mega-pack-5.types";
import { MeshAuditService } from "../observability/mesh-audit.service";

@Injectable()
export class MeshPolicyService {
  private readonly policies =
    new Map<string, MeshCommunicationPolicy>();

  constructor(private readonly audit: MeshAuditService) {
    this.seed();
  }

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(`Mesh policy not found: ${id}`);
    }

    return policy;
  }

  register(
    input: Omit<MeshCommunicationPolicy, "createdAt" | "updatedAt">,
    context: { actorIdentityId: string; correlationId: string }
  ) {
    if (this.policies.has(input.id)) {
      throw new ConflictException(`Mesh policy already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const policy: MeshCommunicationPolicy = {
      ...input,
      timeoutMs: Math.max(100, input.timeoutMs),
      maxAttempts: Math.max(1, input.maxAttempts),
      retryBackoffMs: Math.max(0, input.retryBackoffMs),
      circuitFailureThreshold:
        Math.max(1, input.circuitFailureThreshold),
      circuitResetMs: Math.max(1000, input.circuitResetMs),
      bulkheadConcurrency:
        Math.max(1, input.bulkheadConcurrency),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "mesh-policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        maxAttempts: policy.maxAttempts,
        timeoutMs: policy.timeoutMs
      }
    });

    return policy;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      traceRequired:
        items.filter((x) => x.requireTrace).length,
      identityRequired:
        items.filter((x) => x.requireIdentity).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const policies: MeshCommunicationPolicy[] = [
      {
        id: "mesh-policy:standard",
        name: "Standard Mesh Policy",
        description: "Default resilient service communication policy.",
        timeoutMs: 10000,
        maxAttempts: 3,
        retryBackoffMs: 500,
        circuitFailureThreshold: 3,
        circuitResetMs: 30000,
        bulkheadConcurrency: 20,
        requireTrace: true,
        requireIdentity: true,
        requireHumanApprovalForCritical: true,
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "mesh-policy:critical",
        name: "Critical Mesh Policy",
        description: "High assurance communication policy.",
        timeoutMs: 30000,
        maxAttempts: 5,
        retryBackoffMs: 1000,
        circuitFailureThreshold: 2,
        circuitResetMs: 60000,
        bulkheadConcurrency: 5,
        requireTrace: true,
        requireIdentity: true,
        requireHumanApprovalForCritical: true,
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const policy of policies) {
      this.policies.set(policy.id, policy);
    }
  }
}
