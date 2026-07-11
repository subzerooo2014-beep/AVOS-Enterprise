import { Injectable } from "@nestjs/common";
import { PublisherJobWindowService } from "./publisher-job-window.service";

@Injectable()
export class PublisherQueueWindowService {
  constructor(
    private readonly window: PublisherJobWindowService,
  ) {}

  filter(jobs: any[]) {
    return jobs.filter((j) => this.window.active(j));
  }
}
