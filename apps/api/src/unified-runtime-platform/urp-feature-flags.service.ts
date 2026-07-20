import { Injectable } from "@nestjs/common";

@Injectable()
export class UrpFeatureFlagsService {
  private readonly flags = new Map<string, boolean>([
    ["unified-routing", true],
    ["runtime-resource-control", true],
    ["multi-platform-health", true],
    ["autonomous-upgrade", false],
    ["self-modification", false],
  ]);

  enabled(key: string): boolean {
    return this.flags.get(key) ?? false;
  }

  set(key: string, enabled: boolean, approvedBy: string) {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Feature flag changes require Human Final Authority.");
    }
    this.flags.set(key, enabled);
    return { key, enabled, approvedBy };
  }

  snapshot() {
    return Object.fromEntries(this.flags.entries());
  }
}