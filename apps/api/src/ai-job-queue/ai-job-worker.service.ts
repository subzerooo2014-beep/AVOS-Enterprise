import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { AiJobQueueService } from "./ai-job-queue.service";

@Injectable()
export class AiJobWorkerService {
  private readonly logger = new Logger(AiJobWorkerService.name);
  private working = false;

  constructor(private readonly queue: AiJobQueueService) {}

  @Interval(3000)
  async tick() {
    if (this.working) return;

    this.working = true;

    try {
      await this.processBatch(5);
    } finally {
      this.working = false;
    }
  }

  async processBatch(limit = 5) {
    const jobs = await this.queue.queued(limit);
    const processed = [];

    for (const job of jobs) {
      await this.queue.mark(job.id, "running");

      try {
        await this.execute(job);
        processed.push(await this.queue.mark(job.id, "completed"));
      } catch (e) {
        processed.push(await this.queue.mark(job.id, "failed"));
      }
    }

    return {
      success: true,
      processedCount: processed.length,
      processed,
    };
  }

  private async execute(job: any) {
    this.logger.log(`Executing job ${job.action}`);

    if (String(job.action).includes("FAIL_TEST")) {
      throw new Error("Simulated job failure");
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
