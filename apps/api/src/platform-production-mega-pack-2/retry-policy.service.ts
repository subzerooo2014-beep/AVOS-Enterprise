import { Injectable } from "@nestjs/common";
import { RetryPolicy } from "./platform-production-mega-pack-2.types";
import { ServiceMeshFileStoreService } from "./service-mesh-file-store.service";

@Injectable()
export class RetryPolicyService {
  constructor(
    private readonly store: ServiceMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  configure(
    input: Omit<RetryPolicy, "id" | "createdAt">,
  ): RetryPolicy {
    const policy: RetryPolicy = {
      ...input,
      id: this.id("retry-policy"),
      maxAttempts: Math.max(1, Math.min(10, input.maxAttempts)),
      baseDelayMs: Math.max(0, input.baseDelayMs),
      maxDelayMs: Math.max(input.baseDelayMs, input.maxDelayMs),
      createdAt: this.now(),
    };

    this.store.writeJson(`retry-policies/${policy.id}.json`, policy);
    this.store.writeJson(
      `retry-policies-active/${policy.serviceKey}.json`,
      policy,
    );

    return policy;
  }

  get(serviceKey: string): RetryPolicy {
    return this.store.readJson<RetryPolicy>(
      `retry-policies-active/${serviceKey}.json`,
      {
        id: "retry-policy:default",
        serviceKey,
        maxAttempts: 3,
        baseDelayMs: 100,
        maxDelayMs: 1000,
        backoff: "exponential",
        retryableStatuses: [408, 429, 500, 502, 503, 504],
        enabled: true,
        createdAt: this.now(),
      },
    );
  }

  delay(policy: RetryPolicy, attempt: number): number {
    if (policy.backoff === "fixed") {
      return policy.baseDelayMs;
    }

    if (policy.backoff === "linear") {
      return Math.min(
        policy.maxDelayMs,
        policy.baseDelayMs * attempt,
      );
    }

    return Math.min(
      policy.maxDelayMs,
      policy.baseDelayMs * Math.pow(2, Math.max(0, attempt - 1)),
    );
  }
}