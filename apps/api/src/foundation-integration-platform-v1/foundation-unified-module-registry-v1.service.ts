import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationIntegrationModuleV1 } from "./foundation-integration-platform-v1.types";

@Injectable()
export class FoundationUnifiedModuleRegistryV1Service {
  private readonly modules = new Map<string, FoundationIntegrationModuleV1>();

  upsert(
    input: Omit<FoundationIntegrationModuleV1, "createdAt" | "updatedAt">,
  ): FoundationIntegrationModuleV1 {
    const existing = this.modules.get(input.id);
    const now = new Date().toISOString();

    const moduleRecord: FoundationIntegrationModuleV1 = {
      ...input,
      dependencies: [...input.dependencies],
      capabilities: [...input.capabilities],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.modules.set(moduleRecord.id, moduleRecord);
    return this.clone(moduleRecord);
  }

  markReady(id: string): FoundationIntegrationModuleV1 {
    const moduleRecord = this.requireModule(id);
    moduleRecord.status = "READY";
    moduleRecord.updatedAt = new Date().toISOString();
    return this.clone(moduleRecord);
  }

  get(id: string): FoundationIntegrationModuleV1 {
    return this.clone(this.requireModule(id));
  }

  list(): FoundationIntegrationModuleV1[] {
    return Array.from(this.modules.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.modules.size;
  }

  readyCount(): number {
    return this.list().filter((item) => item.status === "READY").length;
  }

  private requireModule(id: string): FoundationIntegrationModuleV1 {
    const moduleRecord = this.modules.get(id);

    if (!moduleRecord) {
      throw new NotFoundException(`Integrated module '${id}' was not found.`);
    }

    return moduleRecord;
  }

  private clone(item: FoundationIntegrationModuleV1): FoundationIntegrationModuleV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
      capabilities: [...item.capabilities],
    };
  }
}
