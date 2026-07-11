import { Injectable } from "@nestjs/common";
import { PublisherJobFilterService } from "./publisher-job-filter.service";
import { PublisherJobGroupService } from "./publisher-job-group.service";

@Injectable()
export class PublisherJobSummaryService {
  constructor(
    private readonly filter: PublisherJobFilterService,
    private readonly group: PublisherJobGroupService,
  ) {}

  summary(jobs: any[]) {
    return {
      total: jobs.length,
      queued: this.filter.queued(jobs).length,
      processing: this.filter.processing(jobs).length,
      published: this.filter.published(jobs).length,
      failed: this.filter.failed(jobs).length,
      channels: this.group.byChannel(jobs),
      generatedAt: new Date(),
    };
  }
}
