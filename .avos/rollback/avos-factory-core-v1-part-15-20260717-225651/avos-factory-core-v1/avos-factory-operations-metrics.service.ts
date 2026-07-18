import { Injectable } from "@nestjs/common";
import {
  AvosFactoryOperationsMetrics
} from "./avos-factory-operations.contracts";
import {
  AvosFactoryDeadLetterService
} from "./avos-factory-dead-letter.service";
import {
  AvosFactoryJobQueueService
} from "./avos-factory-job-queue.service";
import {
  AvosFactoryLifecycleService
} from "./avos-factory-lifecycle.service";
import {
  AvosFactorySchedulerService
} from "./avos-factory-scheduler.service";

@Injectable()
export class AvosFactoryOperationsMetricsService {
  constructor(
    private readonly lifecycle: AvosFactoryLifecycleService,
    private readonly queue: AvosFactoryJobQueueService,
    private readonly deadLetter: AvosFactoryDeadLetterService,
    private readonly scheduler: AvosFactorySchedulerService
  ) {}

  calculate(): AvosFactoryOperationsMetrics {
    const jobs = this.queue.all();
    const completed = jobs.filter((job) => job.status === "completed").length;
    const terminal = jobs.filter((job) =>
      ["completed", "failed", "dead-lettered", "cancelled"].includes(job.status)
    ).length;

    return {
      lifecycleState: this.lifecycle.current().state,
      queuedJobs: jobs.filter((job) => job.status === "queued").length,
      runningJobs: jobs.filter((job) => job.status === "running").length,
      completedJobs: completed,
      failedJobs: jobs.filter((job) => job.status === "failed").length,
      deadLetterJobs: this.deadLetter.count(),
      cancelledJobs: jobs.filter((job) => job.status === "cancelled").length,
      schedules: this.scheduler.count(),
      enabledSchedules: this.scheduler.enabledCount(),
      totalAttempts: jobs.reduce((sum, job) => sum + job.attempts, 0),
      retryCount: jobs.reduce(
        (sum, job) => sum + Math.max(0, job.attempts - 1),
        0
      ),
      successRate:
        terminal === 0
          ? 100
          : Math.round((completed / terminal) * 100),
      calculatedAt: new Date().toISOString()
    };
  }
}
