import { Injectable, NotFoundException } from "@nestjs/common";
import type { RuntimeCoordinationRecord } from "./core-flow-runtime.types";
import { CoreFlowAuditService } from "./core-flow-audit.service";

@Injectable()
export class CoreFlowRuntimeCoordinatorService {
  private readonly records = new Map<string, RuntimeCoordinationRecord>();

  constructor(private readonly audit: CoreFlowAuditService) {}

  plan(executionId: string, sourceFlow: string, targetFlows: string[]) {
    const record: RuntimeCoordinationRecord = {
      id: `coordination_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      sourceFlow,
      targetFlows: Array.isArray(targetFlows) ? targetFlows.map(String) : [],
      status: "planned",
      createdAt: new Date().toISOString(),
    };
    this.records.set(record.id, record);
    this.audit.write(record.id, "runtime.coordination.planned", { executionId, sourceFlow, targetFlows });
    return record;
  }

  findAll(executionId?: string) {
    return Array.from(this.records.values())
      .filter((item) => !executionId || item.executionId === executionId)
      .slice().reverse();
  }

  findOne(id: string) {
    const record = this.records.get(id);
    if (!record) throw new NotFoundException("Runtime coordination record not found");
    return record;
  }

  execute(id: string) {
    const record = this.findOne(id);
    record.status = "executing";
    this.audit.write(id, "runtime.coordination.executing");
    record.status = "completed";
    record.completedAt = new Date().toISOString();
    this.audit.write(id, "runtime.coordination.completed");
    return record;
  }
}
