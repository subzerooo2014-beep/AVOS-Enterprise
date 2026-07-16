import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousDeliveryPolicy } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousDeliveryPolicyService {
  private readonly policies =
    new Map<string, NervousDeliveryPolicy>();

  constructor(
    private readonly audit: NervousRoutingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(`Nervous delivery policy not found: ${id}`);
    }

    return policy;
  }

  register(
    input: Omit<NervousDeliveryPolicy, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.policies.has(input.id)) {
      throw new ConflictException(
        `Nervous delivery policy already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const policy: NervousDeliveryPolicy = {
      ...input,
      maxAttempts: Math.max(1, input.maxAttempts),
      retryBackoffMs: Math.max(0, input.retryBackoffMs),
      timeoutMs: Math.max(100, input.timeoutMs),
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "policy",
      action: "nervous-delivery-policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        maxAttempts: policy.maxAttempts,
        deadLetterEnabled: policy.deadLetterEnabled
      }
    });

    return policy;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      ordered: items.filter((x) => x.orderedDelivery).length,
      idempotent: items.filter((x) => x.idempotencyRequired).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const items: NervousDeliveryPolicy[] = [
      {
        id: "delivery-policy:standard",
        name: "Standard Delivery",
        description: "Default reliable delivery policy.",
        maxAttempts: 3,
        retryBackoffMs: 1000,
        exponentialBackoff: true,
        deadLetterEnabled: true,
        timeoutMs: 15000,
        orderedDelivery: false,
        idempotencyRequired: true,
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "delivery-policy:critical",
        name: "Critical Delivery",
        description: "High-assurance delivery policy.",
        maxAttempts: 5,
        retryBackoffMs: 500,
        exponentialBackoff: true,
        deadLetterEnabled: true,
        timeoutMs: 30000,
        orderedDelivery: true,
        idempotencyRequired: true,
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of items) {
      this.policies.set(item.id, item);
    }
  }
}
