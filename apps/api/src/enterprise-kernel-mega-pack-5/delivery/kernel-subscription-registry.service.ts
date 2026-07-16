import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { KernelSubscription } from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageContractRegistryService } from "../contracts/kernel-message-contract-registry.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelSubscriptionRegistryService {
  private readonly subscriptions = new Map<string, KernelSubscription>();

  constructor(
    private readonly contracts: KernelMessageContractRegistryService,
    private readonly audit: KernelMessagingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.subscriptions.values());
  }

  get(id: string) {
    const subscription = this.subscriptions.get(id);

    if (!subscription) {
      throw new NotFoundException(`Kernel subscription not found: ${id}`);
    }

    return subscription;
  }

  register(
    input: Omit<KernelSubscription, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.contracts.get(input.contractId);

    if (this.subscriptions.has(input.id)) {
      throw new ConflictException(`Kernel subscription already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const subscription: KernelSubscription = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.subscriptions.set(subscription.id, subscription);

    this.audit.record({
      correlationId: context.correlationId,
      category: "delivery",
      action: "kernel-subscription-registered",
      subjectId: subscription.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        contractId: subscription.contractId,
        consumerId: subscription.consumerId
      }
    });

    return subscription;
  }

  byContract(contractId: string) {
    this.contracts.get(contractId);

    return this.list()
      .filter(
        (subscription) =>
          subscription.contractId === contractId &&
          subscription.active
      )
      .sort((left, right) => right.priority - left.priority);
  }

  summary() {
    const subscriptions = this.list();

    return {
      total: subscriptions.length,
      active: subscriptions.filter((x) => x.active).length,
      approvalRequired: subscriptions.filter((x) => x.requiresHumanApproval).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const subscriptions: KernelSubscription[] = [
      {
        id: "kernel-subscription:module-state-runtime",
        contractId: "kernel-contract:event.module-state-changed",
        consumerId: "kernel:runtime",
        active: true,
        priority: 100,
        maxRetries: 3,
        retryDelayMilliseconds: 100,
        deliveryGuarantee: "at-least-once",
        requiresHumanApproval: false,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-subscription:execute-operation",
        contractId: "kernel-contract:command.execute-operation",
        consumerId: "kernel:execution",
        active: true,
        priority: 100,
        maxRetries: 3,
        retryDelayMilliseconds: 100,
        deliveryGuarantee: "at-least-once",
        requiresHumanApproval: false,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-subscription:runtime-query",
        contractId: "kernel-contract:query.runtime-status",
        consumerId: "kernel:runtime",
        active: true,
        priority: 100,
        maxRetries: 1,
        retryDelayMilliseconds: 0,
        deliveryGuarantee: "at-most-once",
        requiresHumanApproval: false,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const subscription of subscriptions) {
      this.subscriptions.set(subscription.id, subscription);
    }
  }
}
