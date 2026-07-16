import { Injectable, NotFoundException } from "@nestjs/common";
import type { CloudRegionRecord } from "./enterprise-global-cloud.types";

@Injectable()
export class CloudRegionRegistryService {
  private readonly regions = new Map<string, CloudRegionRecord>();

  register(
    input: Omit<CloudRegionRecord, "createdAt" | "updatedAt">,
  ): CloudRegionRecord {
    const existing = this.regions.get(input.id);
    const now = new Date().toISOString();

    const region: CloudRegionRecord = {
      ...input,
      capabilities: [...input.capabilities],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.regions.set(region.id, region);
    return this.clone(region);
  }

  get(id: string): CloudRegionRecord {
    const region = this.regions.get(id);

    if (!region) {
      throw new NotFoundException(`Cloud region '${id}' was not found.`);
    }

    return this.clone(region);
  }

  list(): CloudRegionRecord[] {
    return Array.from(this.regions.values())
      .map((region) => this.clone(region))
      .sort((a, b) => a.priority - b.priority);
  }

  count(): number {
    return this.regions.size;
  }

  activeCount(): number {
    return this.list().filter((region) => region.status === "ACTIVE").length;
  }

  private clone(region: CloudRegionRecord): CloudRegionRecord {
    return {
      ...region,
      capabilities: [...region.capabilities],
    };
  }
}
