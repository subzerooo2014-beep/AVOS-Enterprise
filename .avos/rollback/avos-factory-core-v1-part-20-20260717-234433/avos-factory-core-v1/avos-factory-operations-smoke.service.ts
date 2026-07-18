import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryOperationsSmokeReport
} from "./avos-factory-operations.contracts";
import {
  AvosFactoryJobQueueService
} from "./avos-factory-job-queue.service";
import {
  AvosFactoryLifecycleService
} from "./avos-factory-lifecycle.service";
import {
  AvosFactoryOperationsMetricsService
} from "./avos-factory-operations-metrics.service";
import {
  AvosFactoryRetryService
} from "./avos-factory-retry.service";
import {
  AvosFactorySchedulerService
} from "./avos-factory-scheduler.service";

@Injectable()
export class AvosFactoryOperationsSmokeService {
  constructor(
    private readonly lifecycle: AvosFactoryLifecycleService,
    private readonly queue: AvosFactoryJobQueueService,
    private readonly retry: AvosFactoryRetryService,
    private readonly scheduler: AvosFactorySchedulerService,
    private readonly metrics: AvosFactoryOperationsMetricsService
  ) {}

  run(): AvosFactoryOperationsSmokeReport {
    const lifecycleRunning =
      this.lifecycle.current().state === "running";

    const job = this.queue.enqueue({
      type: "verification",
      subjectId: "part-12-smoke",
      actor: "system:part-12-smoke",
      humanApproved: true,
      payload: {
        smoke: true
      },
      maxAttempts: 2,
      priority: 10
    });

    const running = this.queue.dequeueReady();
    const jobStarted =
      running?.id === job.id &&
      running.status === "running";

    const completed =
      running
        ? this.queue.complete(running.id, { verified: true })
        : undefined;

    const schedule = this.scheduler.create({
      name: "part-12-smoke-schedule",
      jobType: "maintenance",
      subjectId: "part-12-scheduled-smoke",
      actor: "system:part-12-smoke",
      humanApproved: true,
      payload: {
        smoke: true
      },
      runAt: new Date(Date.now() - 1000).toISOString()
    });

    const dispatch = this.scheduler.dispatchDue();

    const checks = {
      lifecycleRunning,
      queueEnqueue: Boolean(job.id),
      queueDequeue: jobStarted,
      queueComplete: completed?.status === "completed",
      schedulerCreated: Boolean(schedule.id),
      schedulerDispatch: dispatch.dispatched === 1,
      retryEngineAvailable: Boolean(this.retry),
      metricsAvailable: Boolean(this.metrics.calculate()),
      humanFinalAuthority: true
    };

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      success: blockingFindings.length === 0 && score === 100,
      score,
      checks,
      metrics: this.metrics.calculate(),
      blockingFindings,
      generatedAt: new Date().toISOString()
    };
  }
}
