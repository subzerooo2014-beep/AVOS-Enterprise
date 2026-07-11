import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { AiJobQueueService } from "./ai-job-queue.service";
import { AiJobWorkerService } from "./ai-job-worker.service";

@Controller("ai-job-queue")
export class AiJobQueueController {
  constructor(
    private readonly service: AiJobQueueService,
    private readonly worker: AiJobWorkerService,
  ) {}

  @Post("enqueue")
  enqueue(@Body() body: any) {
    return this.service.enqueue(
      body.type ?? "AI_JOB",
      body.payload ?? {},
      body.priority ?? 50,
    );
  }

  @Get("queued")
  queued(@Query("limit") limit?: string) {
    return this.service.queued(limit ? Number(limit) : 20);
  }

  @Get("dashboard")
  dashboard() {
    return this.service.dashboard();
  }

  @Post("process")
  process(@Query("limit") limit?: string) {
    return this.worker.processBatch(limit ? Number(limit) : 5);
  }

  @Post("retry-failed")
  retryFailed(@Query("limit") limit?: string) {
    return this.service.retryFailed(limit ? Number(limit) : 20);
  }

  @Post("dead-letter")
  deadLetter(@Query("limit") limit?: string) {
    return this.service.moveFailedToDead(limit ? Number(limit) : 20);
  }

  @Delete("cleanup-completed")
  cleanup(@Query("limit") limit?: string) {
    return this.service.cleanupCompleted(limit ? Number(limit) : 100);
  }
}
