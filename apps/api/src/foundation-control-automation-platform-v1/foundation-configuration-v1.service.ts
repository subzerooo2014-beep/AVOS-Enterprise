import { Injectable } from "@nestjs/common";
import type { FoundationConfigurationV1 } from "./foundation-control-automation-v1.types";

@Injectable()
export class FoundationConfigurationV1Service {
  private readonly configurations = new Map<string, FoundationConfigurationV1>();

  set(
    key: string,
    value: unknown,
    environment: string,
  ): FoundationConfigurationV1 {
    const compositeKey = `${environment}:${key}`;
    const existing = this.configurations.get(compositeKey);

    const configuration: FoundationConfigurationV1 = {
      key,
      value,
      environment,
      version: (existing?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.configurations.set(compositeKey, configuration);
    return { ...configuration };
  }

  get(key: string, environment: string): FoundationConfigurationV1 | undefined {
    const configuration = this.configurations.get(`${environment}:${key}`);
    return configuration ? { ...configuration } : undefined;
  }

  list(): FoundationConfigurationV1[] {
    return Array.from(this.configurations.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.configurations.size;
  }
}
