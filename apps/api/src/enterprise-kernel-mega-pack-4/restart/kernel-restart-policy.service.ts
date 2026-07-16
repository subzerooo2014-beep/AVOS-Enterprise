import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelRestartAttempt,
  KernelRestartPolicy
} from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelIsolationService } from "../isolation/kernel-isolation.service";
import { KernelOperationalModeService } from "../modes/kernel-operational-mode.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelRestartPolicyService {
  private readonly policies = new Map<string, KernelRestartPolicy>();
  private readonly attempts: KernelRestartAttempt[] = [];

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly isolation: KernelIsolationService,
    private readonly modes: KernelOperationalModeService,
    private readonly audit: KernelResilienceAuditService
  ) {
    this.seed();
  }

  listPolicies() {
    return Array.from(this.policies.values());
  }

  listAttempts() {
    return [...this.attempts];
  }

  getPolicy(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(`Kernel restart policy not found: ${id}`);
    }

    return policy;
  }

  register(
    input: Omit<KernelRestartPolicy, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.health.getRecord(input.componentId);

    const now = new Date().toISOString();

    const policy: KernelRestartPolicy = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: context.correlationId,
      category: "restart",
      action: "kernel-restart-policy-registered",
      subjectId: policy.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        componentId: policy.componentId,
        maxAttempts: policy.maxAttempts
      }
    });

    return policy;
  }

  attempt(input: {
    policyId: string;
    actorIdentityId: string;
    correlationId: string;
    reason: string;
    simulateSuccess?: boolean;
    humanApprovedSafeMode?: boolean;
  }) {
    const policy = this.getPolicy(input.policyId);

    if (!policy.enabled) {
      throw new ConflictException(`Kernel restart policy is disabled: ${policy.id}`);
    }

    const recentAttempts = this.attempts.filter(
      (attempt) => attempt.policyId === policy.id
    );

    const attemptNumber = recentAttempts.length + 1;

    if (attemptNumber > policy.maxAttempts) {
      if (policy.isolateAfterExhaustion) {
        this.isolation.isolate({
          componentId: policy.componentId,
          reason: "Restart attempts exhausted.",
          isolatedByIdentityId: input.actorIdentityId,
          correlationId: input.correlationId
        });
      }

      if (policy.enterSafeModeAfterExhaustion) {
        this.modes.transition({
          toMode: "safe",
          reason: "Restart attempts exhausted.",
          actorIdentityId: input.actorIdentityId,
          correlationId: input.correlationId,
          humanApproved: input.humanApprovedSafeMode ?? false
        });
      }

      throw new ConflictException(
        `Kernel restart attempts exhausted for ${policy.componentId}.`
      );
    }

    const successful = input.simulateSuccess ?? true;

    const attempt: KernelRestartAttempt = {
      id: `kernel-restart-attempt:${Date.now()}:${this.attempts.length + 1}`,
      policyId: policy.id,
      componentId: policy.componentId,
      attempt: attemptNumber,
      successful,
      reason: input.reason,
      correlationId: input.correlationId,
      attemptedAt: new Date().toISOString()
    };

    this.attempts.push(attempt);

    this.health.ingestSignal({
      componentId: policy.componentId,
      status: successful ? "healthy" : "unhealthy",
      score: successful ? 100 : 30,
      source: "kernel-restart-policy",
      message: successful
        ? "Component restart completed successfully."
        : "Component restart failed.",
      actorIdentityId: input.actorIdentityId,
      correlationId: input.correlationId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "restart",
      action: "kernel-component-restart-attempted",
      subjectId: attempt.id,
      actorIdentityId: input.actorIdentityId,
      outcome: successful ? "success" : "failure",
      metadata: {
        componentId: policy.componentId,
        attempt: attemptNumber
      }
    });

    return attempt;
  }

  summary() {
    return {
      policies: this.policies.size,
      enabledPolicies: this.listPolicies().filter((x) => x.enabled).length,
      attempts: this.attempts.length,
      successfulAttempts: this.attempts.filter((x) => x.successful).length,
      failedAttempts: this.attempts.filter((x) => !x.successful).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const policies: KernelRestartPolicy[] = [
      {
        id: "kernel-restart-policy:runtime",
        componentId: "kernel:runtime",
        enabled: true,
        maxAttempts: 3,
        windowSeconds: 300,
        delayMilliseconds: 1000,
        backoffMultiplier: 2,
        isolateAfterExhaustion: true,
        enterSafeModeAfterExhaustion: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-restart-policy:lifecycle",
        componentId: "kernel:lifecycle",
        enabled: true,
        maxAttempts: 3,
        windowSeconds: 300,
        delayMilliseconds: 1000,
        backoffMultiplier: 2,
        isolateAfterExhaustion: true,
        enterSafeModeAfterExhaustion: false,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const policy of policies) {
      this.policies.set(policy.id, policy);
    }
  }
}
