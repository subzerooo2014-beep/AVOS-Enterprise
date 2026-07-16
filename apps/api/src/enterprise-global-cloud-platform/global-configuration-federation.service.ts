import { Injectable } from "@nestjs/common";
import type { GlobalConfigurationRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class GlobalConfigurationFederationService {
  private readonly configurations = new Map<
    string,
    GlobalConfigurationRecord
  >();

  set(
    namespace: string,
    key: string,
    value: unknown,
    regionOverrides: Record<string, unknown> = {},
  ): GlobalConfigurationRecord {
    const id = `${namespace}:${key}`;
    const existing = this.configurations.get(id);

    const configuration: GlobalConfigurationRecord = {
      id,
      namespace,
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      regionOverrides: { ...regionOverrides },
      updatedAt: new Date().toISOString(),
    };

    this.configurations.set(id, configuration);
    return this.clone(configuration);
  }

  resolve(namespace: string, key: string, regionId?: string): unknown {
    const configuration = this.configurations.get(`${namespace}:${key}`);

    if (!configuration) {
      return undefined;
    }

    if (
      regionId &&
      Object.prototype.hasOwnProperty.call(
        configuration.regionOverrides,
        regionId,
      )
    ) {
      return configuration.regionOverrides[regionId];
    }

    return configuration.value;
  }

  list(): GlobalConfigurationRecord[] {
    return Array.from(this.configurations.values()).map((configuration) =>
      this.clone(configuration),
    );
  }

  count(): number {
    return this.configurations.size;
  }

  private clone(
    configuration: GlobalConfigurationRecord,
  ): GlobalConfigurationRecord {
    return {
      ...configuration,
      regionOverrides: { ...configuration.regionOverrides },
    };
  }
}
