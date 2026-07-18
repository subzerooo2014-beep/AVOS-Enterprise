import { Injectable } from "@nestjs/common";
import {
  AvosFactoryDeadLetterService
} from "./avos-factory-dead-letter.service";
import {
  AvosFactoryJobQueueService
} from "./avos-factory-job-queue.service";
import {
  AvosFactoryJob
} from "./avos-factory-operations.contracts";

@Injectable()
export class AvosFactoryRetryService {
  constructor(
    private readonly queue: AvosFactoryJobQueueService,
    private readonly deadLetter: AvosFactoryDeadLetterService
  ) {}

  handleFailure(
    jobId: string,
    error: string
  ): {
    action: "requeued" | "dead-lettered";
    job: AvosFactoryJob;
  } {
    const failed = this.queue.fail(jobId, error);

    if (failed.attempts < failed.maxAttempts) {
      return {
        action: "requeued",
        job: this.queue.requeue(jobId)
      };
    }

    const deadLettered = this.queue.deadLetter(jobId);
    this.deadLetter.add(deadLettered, error);

    return {
      action: "dead-lettered",
      job: deadLettered
    };
  }
}
