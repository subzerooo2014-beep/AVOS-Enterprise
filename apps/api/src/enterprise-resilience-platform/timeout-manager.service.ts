import { Injectable, RequestTimeoutException } from "@nestjs/common";
import type { TimeoutPolicyRecord } from "./enterprise-resilience.types";

@Injectable()
export class TimeoutManagerService {
  private readonly policies = new Map<string, TimeoutPolicyRecord>();

  register(policy: TimeoutPolicyRecord): TimeoutPolicyRecord {
    this.policies.set(policy.id, { ...policy });
    return { ...policy };
  }

  async execute<T>(policyId: string, handler: () => Promise<T>): Promise<T> {
    const policy = this.policies.get(policyId) ?? {
      id: policyId,
      timeoutMs: 5000,
      enabled: true,
    };

    if (!policy.enabled) {
      return handler();
    }

    return Promise.race([
      handler(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new RequestTimeoutException(
                `Operation exceeded timeout policy '${policy.id}'.`,
              ),
            ),
          policy.timeoutMs,
        ),
      ),
    ]);
  }

  list(): TimeoutPolicyRecord[] {
    return Array.from(this.policies.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.policies.size;
  }
}
