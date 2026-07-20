import { Injectable } from "@nestjs/common";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpVersionManagerService {
  constructor(private readonly registry: UrpRuntimeRegistryService) {}

  inventory() {
    return this.registry.list().map((unit) => ({
      key: unit.key,
      name: unit.name,
      version: unit.version,
      status: unit.status,
    }));
  }

  assessUpgrade(
    key: string,
    targetVersion: string,
    approvedBy?: string,
  ) {
    const unit = this.registry.get(key);
    return {
      key,
      currentVersion: unit.version,
      targetVersion,
      status: approvedBy?.startsWith("human:")
        ? "approved-for-planning"
        : "requires-human-approval",
      executable: false,
      reason:
        "URP-1.0 manages upgrade governance; deployment execution remains adapter-bound.",
      assessedAt: new Date().toISOString(),
    };
  }
}