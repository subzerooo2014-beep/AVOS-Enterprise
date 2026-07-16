import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationIntegrationCapabilityV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationUnifiedCapabilityRegistryV1Service {
  private readonly capabilities = new Map<string, FoundationIntegrationCapabilityV1>();

  upsert(
    input: Omit<FoundationIntegrationCapabilityV1, "updatedAt">,
  ): FoundationIntegrationCapabilityV1 {
    const capability: FoundationIntegrationCapabilityV1 = {
      ...input,
      dependencies: [...input.dependencies],
      updatedAt: new Date().toISOString(),
    };

    this.capabilities.set(capability.id, capability);
    return this.clone(capability);
  }

  get(id: string): FoundationIntegrationCapabilityV1 {
    const capability = this.capabilities.get(id);

    if (!capability) {
      throw new NotFoundException(`Integrated capability '${id}' was not found.`);
    }

    return this.clone(capability);
  }

  list(): FoundationIntegrationCapabilityV1[] {
    return Array.from(this.capabilities.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.capabilities.size;
  }

  availableCount(): number {
    return this.list().filter((item) => item.status === "AVAILABLE").length;
  }

  private clone(
    item: FoundationIntegrationCapabilityV1,
  ): FoundationIntegrationCapabilityV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
    };
  }
}
