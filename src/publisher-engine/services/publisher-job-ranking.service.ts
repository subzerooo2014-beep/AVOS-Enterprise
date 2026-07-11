import { Injectable } from "@nestjs/common";
import { PublisherJobPriorityService } from "./publisher-job-priority.service";

@Injectable()
export class PublisherJobRankingService {
  constructor(
    private readonly priority: PublisherJobPriorityService,
  ) {}

  rank(jobs: any[]) {
    return jobs.map(job => ({
      job,
      score: this.priority.calculate(job),
    }))
    .sort((a,b)=>b.score-a.score);
  }
}
