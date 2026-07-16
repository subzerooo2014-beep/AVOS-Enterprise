import { Injectable } from "@nestjs/common";
import { RuntimeServiceRegistryV1Service } from "./runtime-service-registry-v1.service";
import type { RuntimeFailoverRecordV1 } from "./enterprise-runtime-platform-v1.types";

@Injectable()
export class RuntimeFailoverManagerV1Service {
  private readonly records: RuntimeFailoverRecordV1[] = [];

  constructor(private readonly services: RuntimeServiceRegistryV1Service) {}

  execute(
    serviceId: string,
    fromNode: string,
    toNode: string,
  ): RuntimeFailoverRecordV1 {
    this.services.get(serviceId);

    const record: RuntimeFailoverRecordV1 = {
      id: `runtime-failover-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      serviceId,
      fromNode,
      toNode,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    this.services.transition(serviceId, "READY");
    this.records.unshift(record);
    return { ...record };
  }

  list(): RuntimeFailoverRecordV1[] {
    return this.records.map((item) => ({ ...item }));
  }

  count(): number {
    return this.records.length;
  }
}
