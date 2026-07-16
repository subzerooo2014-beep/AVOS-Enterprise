import { Injectable } from "@nestjs/common";
import type { ConfigurationRecord } from "./enterprise-platform-services-control-plane.types";

@Injectable()
export class ConfigurationCenterService {
  private readonly configurations = new Map<string, ConfigurationRecord>();

  set(
    input: Omit<ConfigurationRecord, "version" | "updatedAt">,
  ): ConfigurationRecord {
    const compositeKey = `${input.scope}:${input.scopeId ?? "global"}:${input.key}`;
    const current = this.configurations.get(compositeKey);

    const configuration: ConfigurationRecord = {
      ...input,
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.configurations.set(compositeKey, configuration);
    return { ...configuration };
  }

  get(
    key: string,
    scope: ConfigurationRecord["scope"] = "GLOBAL",
    scopeId?: string,
  ): ConfigurationRecord | undefined {
    const configuration = this.configurations.get(
      `${scope}:${scopeId ?? "global"}:${key}`,
    );

    return configuration ? { ...configuration } : undefined;
  }

  list(): ConfigurationRecord[] {
    return Array.from(this.configurations.values()).map((item) => ({
      ...item,
    }));
  }

  count(): number {
    return this.configurations.size;
  }
}
