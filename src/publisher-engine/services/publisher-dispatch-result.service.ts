import { Injectable } from "@nestjs/common";
import { PublisherJobReporterService } from "./publisher-job-reporter.service";

@Injectable()
export class PublisherDispatchResultService {
  constructor(
    private readonly reporter: PublisherJobReporterService,
  ) {}

  finish(job: any, result: any) {
    return this.reporter.report(job, result);
  }
}
