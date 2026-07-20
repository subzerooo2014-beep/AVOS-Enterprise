import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsCreateDurableWorkflow } from "./ags-durable.contracts";
import { AgsDurableAuditService } from "./ags-durable-audit.service";
import { AgsDurableIdService } from "./ags-durable-id.service";
import { AgsDistributedQueueService } from "./ags-distributed-queue.service";
import { AgsEventStoreService } from "./ags-event-store.service";

@Injectable()
export class AgsDurableWorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ids: AgsDurableIdService,
    private readonly events: AgsEventStoreService,
    private readonly queue: AgsDistributedQueueService,
    private readonly audit: AgsDurableAuditService,
  ) {}

  async create(input: AgsCreateDurableWorkflow) {
    if (!input.steps?.length) {
      throw new Error("Durable workflow requires at least one step.");
    }

    const id = this.ids.create("ags-durable-workflow");
    const correlationId = this.ids.create("ags-correlation");

    const workflow = await (this.prisma as any).agsDurableWorkflow.create({
      data: {
        id,
        name: input.name,
        objective: input.objective,
        state: "created",
        riskLevel: input.riskLevel ?? "medium",
        steps: input.steps,
        completedSteps: [],
        requestedBy: input.requestedBy ?? "human:khalifa",
        correlationId,
      },
    });

    await this.events.append({
      streamId: id,
      streamType: "AgsDurableWorkflow",
      eventType: "ags.workflow.created",
      payload: {
        name: workflow.name,
        objective: workflow.objective,
        riskLevel: workflow.riskLevel,
      },
      metadata: { correlationId, actor: workflow.requestedBy },
    });

    await this.audit.record({
      action: "workflow.create",
      actor: workflow.requestedBy,
      entityType: "AgsDurableWorkflow",
      entityId: id,
      correlationId,
      after: workflow,
    });

    return workflow;
  }

  async start(id: string, actor = "human:khalifa") {
    const before = await this.get(id);
    if (!["created", "waiting", "failed"].includes(before.state)) return before;

    const workflow = await (this.prisma as any).agsDurableWorkflow.update({
      where: { id },
      data: { state: "queued", version: { increment: 1 } },
    });

    await this.queue.enqueue({
      queue: "ags-workflow",
      type: "ags.workflow.execute",
      payload: { workflowId: id },
      correlationId: workflow.correlationId,
      idempotencyKey:
        "workflow-start:" + id + ":" + String(workflow.version),
    });

    await this.events.append({
      streamId: id,
      streamType: "AgsDurableWorkflow",
      eventType: "ags.workflow.queued",
      payload: { workflowId: id },
      metadata: { correlationId: workflow.correlationId, actor },
    });

    await this.audit.record({
      action: "workflow.start",
      actor,
      entityType: "AgsDurableWorkflow",
      entityId: id,
      correlationId: workflow.correlationId,
      before,
      after: workflow,
    });

    return workflow;
  }

  get(id: string) {
    return (this.prisma as any).agsDurableWorkflow.findUniqueOrThrow({
      where: { id },
    });
  }

  list(state?: string) {
    return (this.prisma as any).agsDurableWorkflow.findMany({
      where: state ? { state } : undefined,
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }

  executeNextStep(workflowId: string, workerId: string) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      const workflow = await tx.agsDurableWorkflow.findUniqueOrThrow({
        where: { id: workflowId },
      });

      const steps = workflow.steps as Array<Record<string, unknown>>;
      const completedSteps = workflow.completedSteps as string[];

      if (workflow.currentStep >= steps.length) {
        const completed = await tx.agsDurableWorkflow.update({
          where: { id: workflowId },
          data: {
            state: "completed",
            leaseOwner: null,
            leaseExpiresAt: null,
            version: { increment: 1 },
          },
        });
        return { workflow: completed, finished: true };
      }

      const step = steps[workflow.currentStep] as Record<string, unknown>;
      const nextIndex = workflow.currentStep + 1;
      const finished = nextIndex >= steps.length;

      const aggregate = await tx.agsEventRecord.aggregate({
        where: { streamId: workflowId },
        _max: { sequence: true },
      });

      const updated = await tx.agsDurableWorkflow.update({
        where: { id: workflowId },
        data: {
          state: finished ? "completed" : "running",
          currentStep: nextIndex,
          completedSteps: [...completedSteps, String(step.key)],
          leaseOwner: workerId,
          leaseExpiresAt: new Date(Date.now() + 60000),
          version: { increment: 1 },
        },
      });

      const eventType = finished
        ? "ags.workflow.completed"
        : "ags.workflow.step.completed";

      await tx.agsEventRecord.create({
        data: {
          id: this.ids.create("ags-event"),
          streamId: workflowId,
          streamType: "AgsDurableWorkflow",
          eventType,
          sequence: Number(aggregate?._max?.sequence ?? 0) + 1,
          payload: {
            stepKey: step.key,
            capabilityKey: step.capabilityKey,
            operation: step.operation,
            currentStep: nextIndex,
          },
          metadata: {
            workerId,
            correlationId: workflow.correlationId,
          },
        },
      });

      await tx.agsOutboxMessage.create({
        data: {
          id: this.ids.create("ags-outbox"),
          topic: "avos.ags.workflow",
          eventType,
          payload: { workflowId, step, currentStep: nextIndex, finished },
          headers: { workerId, correlationId: workflow.correlationId },
        },
      });

      return { workflow: updated, step, finished };
    });
  }
}