import { Injectable, NotFoundException } from "@nestjs/common";
import { SuperAppV3DealService } from "../super-app-v3/super-app-v3.deal.service";
import { SuperAppV4WorkflowService } from "../super-app-v4/super-app-v4.workflow.service";
import { SuperAppV5AuditService } from "../super-app-v5/super-app-v5.audit.service";
import { SuperAppV5NotificationService } from "../super-app-v5/super-app-v5.notification.service";
import { SuperAppV5QueueService } from "../super-app-v5/super-app-v5.queue.service";
import { UnifiedRuntimeRecord } from "./super-app-v6.types";

@Injectable()
export class SuperAppV6RuntimeService {
  private readonly runtimes = new Map<string, UnifiedRuntimeRecord>();

  constructor(
    private readonly deals: SuperAppV3DealService,
    private readonly integrations: SuperAppV4WorkflowService,
    private readonly queue: SuperAppV5QueueService,
    private readonly notifications: SuperAppV5NotificationService,
    private readonly audit: SuperAppV5AuditService,
  ) {}

  start(input: {
    buyerId: string;
    sellerId: string;
    vehicleId: string;
    userId: string;
    askingPrice: number;
    acceptedPrice?: number;
    financingRequired: boolean;
    insuranceRequired: boolean;
    inspectionRequired: boolean;
    paymentRequired: boolean;
    shippingRequired?: boolean;
    exportRequired?: boolean;
  }) {
    const now = new Date().toISOString();
    const runtimeId = `runtime_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const correlationId = `corr_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const deal = this.deals.create({
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      vehicleId: input.vehicleId,
      askingPrice: input.askingPrice,
    });

    if (input.acceptedPrice) {
      this.deals.negotiate(deal.id, {
        actor: "AZM",
        amount: input.acceptedPrice,
        message: "Unified runtime accepted negotiated price.",
        accept: true,
      });
    }

    const runtime: UnifiedRuntimeRecord = {
      id: runtimeId,
      dealId: deal.id,
      buyerId: input.buyerId,
      sellerId: input.sellerId,
      vehicleId: input.vehicleId,
      userId: input.userId,
      status: "MATCHED",
      correlationId,
      integrationRequestIds: [],
      jobIds: [],
      notificationIds: [],
      completedSteps: ["deal_created"],
      createdAt: now,
      updatedAt: now,
    };

    this.runtimes.set(runtime.id, runtime);

    const integrationResult = this.integrations.startDealIntegrations({
      dealId: deal.id,
      financingRequired: input.financingRequired,
      insuranceRequired: input.insuranceRequired,
      inspectionRequired: input.inspectionRequired,
      paymentRequired: input.paymentRequired,
      shippingRequired: input.shippingRequired,
      exportRequired: input.exportRequired,
    });

    runtime.integrationRequestIds = integrationResult.requests.map(
      (request) => request.id,
    );
    runtime.status = "INTEGRATIONS_STARTED";
    runtime.completedSteps.push("integrations_started");

    for (const request of integrationResult.requests) {
      const queued = this.queue.enqueue({
        idempotencyKey: `${runtime.id}:${request.id}`,
        correlationId,
        partnerId: request.partnerId,
        requestId: request.id,
        jobType: `${request.partnerType}_PROCESSING`,
        payload: {
          runtimeId: runtime.id,
          dealId: deal.id,
          integrationRequestId: request.id,
        },
      });

      runtime.jobIds.push(queued.job.id);
    }

    runtime.status = "JOBS_QUEUED";
    runtime.completedSteps.push("jobs_queued");

    const notification = this.notifications.queue({
      userId: input.userId,
      title: "بدأت معالجة الصفقة",
      message:
        "تم إنشاء الصفقة وربط خدمات التمويل والتأمين والفحص والدفع المطلوبة.",
      channel: "IN_APP",
    });

    runtime.notificationIds.push(notification.id);
    runtime.completedSteps.push("notification_queued");

    this.audit.record({
      action: "UNIFIED_RUNTIME_STARTED",
      entityType: "UnifiedRuntime",
      entityId: runtime.id,
      correlationId,
      metadata: {
        dealId: deal.id,
        integrationRequests: runtime.integrationRequestIds.length,
        jobs: runtime.jobIds.length,
      },
    });

    runtime.updatedAt = new Date().toISOString();

    return {
      runtime,
      deal: this.deals.get(deal.id),
      integrations: integrationResult.requests,
    };
  }

  process(id: string) {
    const runtime = this.get(id);
    runtime.status = "PROCESSING";
    runtime.updatedAt = new Date().toISOString();

    const processed = [];
    let next = this.queue.processNext();

    while (next && runtime.jobIds.includes(next.id)) {
      processed.push(next);
      next = this.queue.processNext();
    }

    const allJobs = runtime.jobIds.map((jobId) => this.queue.get(jobId));
    const failed = allJobs.find((job) =>
      ["FAILED", "DEAD_LETTER"].includes(job.status),
    );
    const allCompleted = allJobs.every((job) => job.status === "COMPLETED");

    if (failed) {
      runtime.status = "FAILED";
      runtime.failedStep = "job_processing";
      runtime.lastError = failed.lastError ?? "Integration job failed";
    } else if (allCompleted) {
      runtime.status = "COMPLETED";
      runtime.completedSteps.push("all_jobs_completed");

      const notification = this.notifications.queue({
        userId: runtime.userId,
        title: "اكتملت معالجة الصفقة",
        message: "تمت معالجة جميع خدمات الصفقة بنجاح.",
        channel: "PUSH",
      });

      runtime.notificationIds.push(notification.id);
      runtime.completedSteps.push("completion_notification_queued");
    }

    this.audit.record({
      action:
        runtime.status === "COMPLETED"
          ? "UNIFIED_RUNTIME_COMPLETED"
          : runtime.status === "FAILED"
            ? "UNIFIED_RUNTIME_FAILED"
            : "UNIFIED_RUNTIME_PROCESSED",
      entityType: "UnifiedRuntime",
      entityId: runtime.id,
      correlationId: runtime.correlationId,
      metadata: {
        processedJobs: processed.length,
        status: runtime.status,
      },
    });

    runtime.updatedAt = new Date().toISOString();

    return {
      runtime,
      jobs: allJobs,
      processedJobs: processed.length,
    };
  }

  get(id: string): UnifiedRuntimeRecord {
    const runtime = this.runtimes.get(id);
    if (!runtime) {
      throw new NotFoundException(`Unified runtime ${id} not found`);
    }
    return runtime;
  }

  list(): UnifiedRuntimeRecord[] {
    return [...this.runtimes.values()];
  }

  dashboard() {
    const runtimes = this.list();

    return {
      totalRuntimes: runtimes.length,
      activeRuntimes: runtimes.filter((runtime) =>
        [
          "CREATED",
          "MATCHED",
          "NEGOTIATING",
          "INTEGRATIONS_STARTED",
          "JOBS_QUEUED",
          "PROCESSING",
        ].includes(runtime.status),
      ).length,
      completedRuntimes: runtimes.filter(
        (runtime) => runtime.status === "COMPLETED",
      ).length,
      failedRuntimes: runtimes.filter(
        (runtime) => runtime.status === "FAILED",
      ).length,
      totalIntegrationRequests: runtimes.reduce(
        (sum, runtime) => sum + runtime.integrationRequestIds.length,
        0,
      ),
      totalJobs: runtimes.reduce(
        (sum, runtime) => sum + runtime.jobIds.length,
        0,
      ),
      totalNotifications: runtimes.reduce(
        (sum, runtime) => sum + runtime.notificationIds.length,
        0,
      ),
      byStatus: runtimes.reduce<Record<string, number>>((acc, runtime) => {
        acc[runtime.status] = (acc[runtime.status] ?? 0) + 1;
        return acc;
      }, {}),
    };
  }
}
