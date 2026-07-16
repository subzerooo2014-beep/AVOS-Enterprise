import { Injectable } from "@nestjs/common";
import type { FoundationFeatureFlagV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationFeatureFlagsV1Service {
  private readonly flags = new Map<string, FoundationFeatureFlagV1>();

  upsert(
    input: Omit<FoundationFeatureFlagV1, "updatedAt">,
  ): FoundationFeatureFlagV1 {
    const flag: FoundationFeatureFlagV1 = {
      ...input,
      environments: [...input.environments],
      metadata: { ...input.metadata },
      rolloutPercentage: Math.max(0, Math.min(100, input.rolloutPercentage)),
      updatedAt: new Date().toISOString(),
    };

    this.flags.set(flag.key, flag);
    return this.clone(flag);
  }

  isEnabled(
    key: string,
    environment: string,
    audienceValue = 0,
  ): boolean {
    const flag = this.flags.get(key);

    if (!flag || !flag.enabled) {
      return false;
    }

    if (
      flag.environments.length > 0 &&
      !flag.environments.includes(environment)
    ) {
      return false;
    }

    return audienceValue <= flag.rolloutPercentage;
  }

  list(): FoundationFeatureFlagV1[] {
    return Array.from(this.flags.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.flags.size;
  }

  private clone(item: FoundationFeatureFlagV1): FoundationFeatureFlagV1 {
    return {
      ...item,
      environments: [...item.environments],
      metadata: { ...item.metadata },
    };
  }
}
