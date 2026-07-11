import { Injectable } from "@nestjs/common";
import { PublisherJobExecutionContextService } from "./publisher-job-execution-context.service";
import { PublisherJobExecutionResultService } from "./publisher-job-execution-result.service";

@Injectable()
export class PublisherJobExecutionEngineService {
  constructor(
    private readonly context: PublisherJobExecutionContextService,
    private readonly result: PublisherJobExecutionResultService,
  ) {}

  execute(job: any, channel: string) {
    const ctx = this.context.create(job, channel);

    return this.result.success(ctx, {
      status: "prepared",
      channel,
      message: "Job execution prepared.",
    });
  }
}
