import { Injectable } from "@nestjs/common";
import { PublisherProductionReportService } from "./publisher-production-report.service";
import { PublisherJobExecutorService } from "./publisher-job-executor.service";

@Injectable()
export class PublisherProductionService {
  constructor(
    private readonly report: PublisherProductionReportService,
    private readonly executor: PublisherJobExecutorService,
  ) {}

  async execute(limit = 20) {
    return {
      success: true,
      execution: await this.executor.execute(limit),
      report: await this.report.report(),
      finishedAt: new Date(),
    };
  }
}
