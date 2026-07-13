import { Injectable, NotFoundException } from "@nestjs/common";
import type { SagaExecution } from "./core-flow-saga.types";
import { CoreFlowAuditService } from "./core-flow-audit.service";
import { CoreFlowSnapshotService } from "./core-flow-snapshot.service";

@Injectable()
export class CoreFlowSagaService {
  private readonly sagas = new Map<string, SagaExecution>();

  constructor(
    private readonly audit: CoreFlowAuditService,
    private readonly snapshots: CoreFlowSnapshotService,
  ) {}

  start(dto: any) {
    const now = new Date().toISOString();
    const saga: SagaExecution = {
      id: `saga_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(dto?.name ?? "core-flow-saga"),
      correlationId: String(dto?.correlationId ?? `${dto?.name}:${dto?.aggregateId}`),
      aggregateType: String(dto?.aggregateType ?? "Unknown"),
      aggregateId: String(dto?.aggregateId ?? "unknown"),
      status: "running",
      currentStep: 0,
      steps: Array.isArray(dto?.steps)
        ? dto.steps.map((step: any) => ({
            name: String(step?.name ?? step),
            status: "pending",
            input: step?.input,
          }))
        : [],
      context: dto?.context ?? {},
      createdAt: now,
      updatedAt: now,
    };
    this.sagas.set(saga.id, saga);
    this.audit.write(saga.id, "saga.started", { name: saga.name });
    this.snapshots.create(saga.id, { ...saga });
    return saga;
  }

  findAll() {
    return Array.from(this.sagas.values()).slice().reverse();
  }

  findOne(id: string) {
    const saga = this.sagas.get(id);
    if (!saga) throw new NotFoundException("Saga execution not found");
    return saga;
  }

  beginStep(id: string, stepName: string) {
    const saga = this.findOne(id);
    const index = saga.steps.findIndex((step) => step.name === stepName);
    if (index < 0) throw new NotFoundException("Saga step not found");
    saga.currentStep = index;
    saga.steps[index].status = "running";
    saga.steps[index].startedAt = new Date().toISOString();
    saga.updatedAt = new Date().toISOString();
    this.audit.write(id, "saga.step.started", { stepName });
    this.snapshots.create(id, { ...saga });
    return saga;
  }

  completeStep(id: string, stepName: string, output?: unknown) {
    const saga = this.findOne(id);
    const index = saga.steps.findIndex((step) => step.name === stepName);
    if (index < 0) throw new NotFoundException("Saga step not found");
    saga.steps[index].status = "completed";
    saga.steps[index].output = output;
    saga.steps[index].completedAt = new Date().toISOString();
    saga.currentStep = Math.min(index + 1, saga.steps.length);
    saga.status = saga.steps.every((step) => step.status === "completed")
      ? "completed"
      : "running";
    saga.updatedAt = new Date().toISOString();
    this.audit.write(id, "saga.step.completed", { stepName });
    this.snapshots.create(id, { ...saga });
    return saga;
  }

  failStep(id: string, stepName: string, error: unknown) {
    const saga = this.findOne(id);
    const index = saga.steps.findIndex((step) => step.name === stepName);
    if (index < 0) throw new NotFoundException("Saga step not found");
    saga.steps[index].status = "failed";
    saga.steps[index].error = error instanceof Error ? error.message : String(error);
    saga.steps[index].completedAt = new Date().toISOString();
    saga.status = "failed";
    saga.updatedAt = new Date().toISOString();
    this.audit.write(id, "saga.step.failed", {
      stepName,
      error: saga.steps[index].error,
    });
    this.snapshots.create(id, { ...saga });
    return saga;
  }

  compensate(id: string, reason?: string) {
    const saga = this.findOne(id);
    for (const step of saga.steps.slice().reverse()) {
      if (step.status === "completed") {
        step.status = "compensated";
      }
    }
    saga.status = "compensated";
    saga.updatedAt = new Date().toISOString();
    this.audit.write(id, "saga.compensated", { reason });
    this.snapshots.create(id, { ...saga });
    return saga;
  }
}
