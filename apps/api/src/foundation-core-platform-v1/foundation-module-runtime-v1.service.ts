import { Injectable, NotFoundException } from "@nestjs/common";
import type { FoundationModuleRecordV1 } from "./foundation-core-platform-v1.types";

@Injectable()
export class FoundationModuleRuntimeV1Service {
  private readonly modules = new Map<string, FoundationModuleRecordV1>();

  register(
    input: Omit<FoundationModuleRecordV1, "createdAt" | "updatedAt">,
  ): FoundationModuleRecordV1 {
    const existing = this.modules.get(input.id);
    const now = new Date().toISOString();

    const moduleRecord: FoundationModuleRecordV1 = {
      ...input,
      dependencies: [...input.dependencies],
      capabilities: [...input.capabilities],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.modules.set(moduleRecord.id, moduleRecord);
    return this.clone(moduleRecord);
  }

  activate(id: string): FoundationModuleRecordV1 {
    const moduleRecord = this.requireModule(id);
    moduleRecord.status = "ACTIVE";
    moduleRecord.updatedAt = new Date().toISOString();
    return this.clone(moduleRecord);
  }

  get(id: string): FoundationModuleRecordV1 {
    return this.clone(this.requireModule(id));
  }

  list(): FoundationModuleRecordV1[] {
    return Array.from(this.modules.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.modules.size;
  }

  private requireModule(id: string): FoundationModuleRecordV1 {
    const moduleRecord = this.modules.get(id);

    if (!moduleRecord) {
      throw new NotFoundException(`Foundation module '${id}' was not found.`);
    }

    return moduleRecord;
  }

  private clone(item: FoundationModuleRecordV1): FoundationModuleRecordV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
      capabilities: [...item.capabilities],
    };
  }
}
