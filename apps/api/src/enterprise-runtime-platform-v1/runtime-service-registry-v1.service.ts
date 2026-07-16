import { Injectable, NotFoundException } from "@nestjs/common";
import type { RuntimeServiceRecordV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeServiceRegistryV1Service {
  private readonly services = new Map<string, RuntimeServiceRecordV1>();

  upsert(
    input: Omit<RuntimeServiceRecordV1, "createdAt" | "updatedAt">,
  ): RuntimeServiceRecordV1 {
    const existing = this.services.get(input.id);
    const now = new Date().toISOString();

    const service: RuntimeServiceRecordV1 = {
      ...input,
      dependencies: [...input.dependencies],
      readinessChecks: [...input.readinessChecks],
      metadata: { ...input.metadata },
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.services.set(service.id, service);
    return this.clone(service);
  }

  transition(
    id: string,
    status: RuntimeServiceRecordV1["status"],
  ): RuntimeServiceRecordV1 {
    const service = this.requireService(id);
    service.status = status;
    service.updatedAt = new Date().toISOString();
    return this.clone(service);
  }

  get(id: string): RuntimeServiceRecordV1 {
    return this.clone(this.requireService(id));
  }

  list(): RuntimeServiceRecordV1[] {
    return Array.from(this.services.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.services.size;
  }

  countByStatus(status: RuntimeServiceRecordV1["status"]): number {
    return this.list().filter((item) => item.status === status).length;
  }

  private requireService(id: string): RuntimeServiceRecordV1 {
    const service = this.services.get(id);

    if (!service) {
      throw new NotFoundException(`Runtime service '${id}' was not found.`);
    }

    return service;
  }

  private clone(item: RuntimeServiceRecordV1): RuntimeServiceRecordV1 {
    return {
      ...item,
      dependencies: [...item.dependencies],
      readinessChecks: [...item.readinessChecks],
      metadata: { ...item.metadata },
    };
  }
}
