import { Injectable } from "@nestjs/common";
import type { FeatureFlagRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class FeatureFlagService {
  private readonly flags = new Map<string, FeatureFlagRecord>();

  set(
    input: Omit<FeatureFlagRecord, "version" | "updatedAt">,
  ): FeatureFlagRecord {
    const compositeKey = `${input.scope}:${input.scopeId ?? "global"}:${input.key}`;
    const current = this.flags.get(compositeKey);

    const flag: FeatureFlagRecord = {
      ...input,
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.flags.set(compositeKey, flag);
    return { ...flag };
  }

  isEnabled(
    key: string,
    scope: FeatureFlagRecord["scope"] = "GLOBAL",
    scopeId?: string,
  ): boolean {
    return (
      this.flags.get(`${scope}:${scopeId ?? "global"}:${key}`)?.enabled ??
      false
    );
  }

  list(): FeatureFlagRecord[] {
    return Array.from(this.flags.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.flags.size;
  }
}
