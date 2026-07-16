import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationCapabilityRecordV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationCapabilityRegistryV1Service {
  private readonly capabilities = new Map<string, FoundationCapabilityRecordV1>();

  register(
    input: Omit<FoundationCapabilityRecordV1, "createdAt" | "updatedAt">,
  ): FoundationCapabilityRecordV1 {
    const existing = this.capabilities.get(input.id);
    const now = new Date().toISOString();

    const capability: FoundationCapabilityRecordV1 = {
      ...input,
      dependencies: [...input.dependencies],
      tags: [...input.tags],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.capabilities.set(capability.id, capability);
    return this.clone(capability);
  }

  transition(
    id: string,
    status: FoundationCapabilityRecordV1["status"],
  ): FoundationCapabilityRecordV1 {
    const capability = this.requireCapability(id);
    capability.status = status;
    capability.updatedAt = new Date().toISOString();
    return this.clone(capability);
  }

  get(id: string): FoundationCapabilityRecordV1 {
    return this.clone(this.requireCapability(id));
  }

  list(): FoundationCapabilityRecordV1[] {
    return Array.from(this.capabilities.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.capabilities.size;
  }

  activeCount(): number {
    return this.list().filter((item) => item.status === "ACTIVE").length;
  }

  private requireCapability(id: string): FoundationCapabilityRecordV1 {
    const capability = this.capabilities.get(id);

    if (!capability) {
      throw new NotFoundException(`Foundation capability '${id}' was not found.`);
    }

    return capability;
  }

  private clone(
    item: FoundationCapabilityRecordV1,
  ): FoundationCapabilityRecordV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
      tags: [...item.tags],
    };
  }
}
