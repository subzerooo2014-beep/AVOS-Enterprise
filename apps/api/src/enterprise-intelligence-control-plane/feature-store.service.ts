import { Injectable } from "@nestjs/common";
import type { FeatureRecord } from "./enterprise-intelligence-control-plane.types";

@Injectable()
export class FeatureStoreService {
  private readonly features = new Map<string, FeatureRecord>();

  set(
    entityId: string,
    key: string,
    value: unknown,
  ): FeatureRecord {
    const compositeKey = `${entityId}:${key}`;
    const existing = this.features.get(compositeKey);

    const feature: FeatureRecord = {
      entityId,
      key,
      value,
      version: (existing?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };

    this.features.set(compositeKey, feature);
    return { ...feature };
  }

  get(entityId: string, key: string): FeatureRecord | undefined {
    const feature = this.features.get(`${entityId}:${key}`);
    return feature ? { ...feature } : undefined;
  }

  list(entityId?: string): FeatureRecord[] {
    return Array.from(this.features.values())
      .filter((feature) => (entityId ? feature.entityId === entityId : true))
      .map((feature) => ({ ...feature }));
  }

  count(): number {
    return this.features.size;
  }
}
