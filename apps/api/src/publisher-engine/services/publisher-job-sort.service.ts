import { Injectable } from "@nestjs/common";
import { PublisherJobPriorityService } from "./publisher-job-priority.service";

@Injectable()
export class PublisherJobSortService {
  constructor(
    private readonly priority: PublisherJobPriorityService,
  ) {}

  sort(jobs: any[]) {
    return [...jobs].sort((a, b) =>
      this.priority.calculate(b) - this.priority.calculate(a),
    );
  }
}
