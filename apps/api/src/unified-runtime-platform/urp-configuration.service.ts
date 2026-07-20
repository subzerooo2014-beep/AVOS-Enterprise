import { Injectable } from "@nestjs/common";

@Injectable()
export class UrpConfigurationService {
  private readonly values = new Map<string, unknown>([
    ["runtime.autoBoot", process.env.AVOS_URP_AUTO_BOOT !== "false"],
    ["runtime.strictDependencies", true],
    ["runtime.humanFinalAuthority", true],
    ["runtime.globalComplianceReadinessGate", true],
  ]);

  get(key: string) {
    return this.values.get(key);
  }

  set(key: string, value: unknown, approvedBy: string) {
    if (!approvedBy.startsWith("human:")) {
      throw new Error("Configuration changes require Human Final Authority.");
    }
    this.values.set(key, value);
    return { key, value, approvedBy, updatedAt: new Date().toISOString() };
  }

  snapshot() {
    return Object.fromEntries(this.values.entries());
  }
}