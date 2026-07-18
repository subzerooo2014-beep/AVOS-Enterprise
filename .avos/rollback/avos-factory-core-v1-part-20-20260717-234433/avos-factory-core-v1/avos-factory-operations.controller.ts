import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryLifecycleState
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
  AvosFactoryOperationsMetricsService
} from "./avos-factory-operations-metrics.service";
import {
  AvosFactoryOperationsSmokeService
} from "./avos-factory-operations-smoke.service";
import {
  AvosFactoryRetryService
} from "./avos-factory-retry.service";
import {
  AvosFactorySchedulerService
} from "./avos-factory-scheduler.service";

@Controller("avos/factory/v1/operations")
export class AvosFactoryOperationsController {
  constructor(
    private readonly lifecycle: AvosFactoryLifecycleService,
    private readonly queue: AvosFactoryJobQueueService,
    private readonly retry: AvosFactoryRetryService,
    private readonly deadLetter: AvosFactoryDeadLetterService,
    private readonly scheduler: AvosFactorySchedulerService,
    private readonly metrics: AvosFactoryOperationsMetricsService,
    private readonly smoke: AvosFactoryOperationsSmokeService
  ) {}

  @Get("lifecycle")
  lifecycleStatus() {
    return this.lifecycle.current();
  }

  @Post("lifecycle/transition")
  transitionLifecycle(
    @Body() input: {
      targetState: AvosFactoryLifecycleState;
      reason?: string;
      actor: string;
      approvedBy?: string;
      humanApproved: boolean;
    }
  ) {
    return this.lifecycle.transition(input);
  }

  @Post("jobs/enqueue")
  enqueue(
    @Body() input: Parameters<AvosFactoryJobQueueService["enqueue"]>[0]
  ) {
    return this.queue.enqueue(input);
  }

  @Post("jobs/dequeue")
  dequeue() {
    return {
      job: this.queue.dequeueReady() ?? null
    };
  }

  @Post("jobs/:id/complete")
  complete(
    @Param("id") id: string,
    @Body() body: { result?: Record<string, unknown> }
  ) {
    return this.queue.complete(id, body.result);
  }

  @Post("jobs/:id/fail")
  fail(
    @Param("id") id: string,
    @Body() body: { error: string }
  ) {
    return this.retry.handleFailure(id, body.error);
  }

  @Post("jobs/:id/cancel")
  cancel(
    @Param("id") id: string,
    @Body() body: {
      actor: string;
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.queue.cancel({
      jobId: id,
      ...body
    });
  }

  @Get("jobs")
  jobs(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.queue.list(
        Number.isFinite(parsed)
          ? Math.trunc(parsed)
          : 100
      )
    };
  }

  @Get("dead-letter")
  deadLetters(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.deadLetter.list(
        Number.isFinite(parsed)
          ? Math.trunc(parsed)
          : 100
      )
    };
  }

  @Post("schedules")
  createSchedule(
    @Body() input: Parameters<AvosFactorySchedulerService["create"]>[0]
  ) {
    return this.scheduler.create(input);
  }

  @Post("schedules/dispatch")
  dispatchSchedules() {
    return this.scheduler.dispatchDue();
  }

  @Get("schedules")
  schedules(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.scheduler.list(
        Number.isFinite(parsed)
          ? Math.trunc(parsed)
          : 100
      )
    };
  }

  @Get("metrics")
  operationMetrics() {
    return this.metrics.calculate();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
