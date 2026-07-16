import { Injectable } from "@nestjs/common";
import type { RetryPolicyRecord } from "./enterprise-resilience.types";

@Injectable()
export class RetryFrameworkService {
  private readonly policies = new Map<string, RetryPolicyRecord>();

  register(policy: RetryPolicyRecord): RetryPolicyRecord {
    this.policies.set(policy.id, { ...policy });
    return { ...policy };
  }

  async execute<T>(
    policyId: string,
    handler: () => Promise<T>,
  ): Promise<{ result: T; attempts: number }> {
    const policy = this.policies.get(policyId) ?? {
      id: policyId,
      maxAttempts: 3,
      baseDelayMs: 50,
      backoffMultiplier: 2,
      enabled: true,
    };

    let lastError: unknown;

    for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
      try {
        return {
          result: await handler(),
          attempts: attempt,
        };
      } catch (error) {
        lastError = error;

        if (!policy.enabled || attempt >= policy.maxAttempts) {
          break;
        }

        const delay =
          policy.baseDelayMs *
          Math.pow(policy.backoffMultiplier, attempt - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  list(): RetryPolicyRecord[] {
    return Array.from(this.policies.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.policies.size;
  }
}
