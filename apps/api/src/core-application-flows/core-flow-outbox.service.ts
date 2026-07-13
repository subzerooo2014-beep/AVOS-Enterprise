import { Injectable, NotFoundException } from "@nestjs/common";
import type { CoreFlowOperation } from "./core-flow-operations.types";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowPolicyService } from "./core-flow-policy.service";
import { CoreFlowSnapshotService } from "./core-flow-snapshot.service";

@Injectable()
export class CoreFlowOutboxService {
  private readonly operations = new Map<string, CoreFlowOperation>();

  constructor(
    private readonly audit: CoreFlowAuditService,
    private readonly policies: CoreFlowPolicyService,
    private readonly snapshots: CoreFlowSnapshotService,
  ) {}

  enqueue(dto: any) {
    this.policies.validateCreate(dto);
    const correlationId = String(
      dto?.correlationId ??
      `${dto.flow}:${dto.aggregateType}:${dto.aggregateId}`,
    );

    const duplicate = Array.from(this.operations.values()).find(
      (item) => item.correlationId === correlationId && item.status !== "failed",
    );
    if (duplicate) return duplicate;

    const now = new Date().toISOString();
    const operation: CoreFlowOperation = {
      id: `operation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      flow: String(dto.flow),
      correlationId,
      aggregateType: String(dto.aggregateType),
      aggregateId: String(dto.aggregateId),
      status: "queued",
      payload: dto?.payload ?? {},
      attempts: 0,
      maxAttempts: this.policies.resolveMaxAttempts(dto),
      priority: this.policies.resolvePriority(dto),
      createdAt: now,
      updatedAt: now,
    };
    this.operations.set(operation.id, operation);
    this.audit.write(operation.id, "operation.queued", { correlationId });
    this.snapshots.create(operation.id, { ...operation });
    return operation;
  }

  findAll(query: any = {}) {
    return Array.from(this.operations.values())
      .filter((item) => !query.status || item.status === query.status)
      .filter((item) => !query.flow || item.flow === query.flow)
      .filter((item) => !query.aggregateId || item.aggregateId === query.aggregateId)
      .sort((a, b) => b.priority - a.priority || b.createdAt.localeCompare(a.createdAt));
  }

  findOne(id: string) {
    const item = this.operations.get(id);
    if (!item) throw new NotFoundException("Core flow operation not found");
    return item;
  }

  claimNext() {
    const now = Date.now();
    const next = this.findAll({ status: "queued" }).find(
      (item) => !item.nextAttemptAt || new Date(item.nextAttemptAt).getTime() <= now,
    );
    if (!next) return null;

    next.status = "processing";
    next.attempts += 1;
    next.updatedAt = new Date().toISOString();
    this.audit.write(next.id, "operation.claimed", { attempt: next.attempts });
    this.snapshots.create(next.id, { ...next });
    return next;
  }

  complete(id: string, result: unknown) {
    const item = this.findOne(id);
    item.status = "completed";
    item.result = result;
    item.error = undefined;
    item.updatedAt = new Date().toISOString();
    this.audit.write(id, "operation.completed");
    this.snapshots.create(id, { ...item });
    return item;
  }

  fail(id: string, error: unknown) {
    const item = this.findOne(id);
    item.error = error instanceof Error ? error.message : String(error);
    item.updatedAt = new Date().toISOString();

    if (item.attempts >= item.maxAttempts) {
      item.status = "dead-lettered";
      this.audit.write(id, "operation.dead-lettered", {
        attempts: item.attempts,
        error: item.error,
      });
    } else {
      item.status = "queued";
      const delaySeconds = Math.min(2 ** item.attempts * 15, 900);
      item.nextAttemptAt = new Date(Date.now() + delaySeconds * 1000).toISOString();
      this.audit.write(id, "operation.retry-scheduled", {
        attempt: item.attempts,
        nextAttemptAt: item.nextAttemptAt,
      });
    }

    this.snapshots.create(id, { ...item });
    return item;
  }

  retry(id: string) {
    const item = this.findOne(id);
    if (!this.policies.canRetry(item.status)) {
      return item;
    }
    item.status = "queued";
    item.nextAttemptAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    this.audit.write(id, "operation.manual-retry");
    this.snapshots.create(id, { ...item });
    return item;
  }

  compensate(id: string, reason?: string) {
    const item = this.findOne(id);
    if (!this.policies.canCompensate(item.status)) return item;
    item.status = "compensated";
    item.updatedAt = new Date().toISOString();
    this.audit.write(id, "operation.compensated", { reason });
    this.snapshots.create(id, { ...item });
    return item;
  }

  dashboard() {
    const items = Array.from(this.operations.values());
    const count = (status: string) => items.filter((item) => item.status === status).length;
    const completed = count("completed");
    return {
      total: items.length,
      queued: count("queued"),
      processing: count("processing"),
      completed,
      failed: count("failed"),
      deadLettered: count("dead-lettered"),
      compensated: count("compensated"),
      successRate: items.length ? Number(((completed / items.length) * 100).toFixed(2)) : 100,
      averageAttempts: items.length
        ? Number((items.reduce((sum, item) => sum + item.attempts, 0) / items.length).toFixed(2))
        : 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
