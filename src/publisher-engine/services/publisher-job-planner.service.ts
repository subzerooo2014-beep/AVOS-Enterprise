import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobPlannerService {
  plan(job: any) {
    return {
      jobId: job.id,
      title: job.title,
      channel: job?.result?.channel ?? "internal",
      priority: job.priority ?? "normal",
      plannedAt: new Date(),
    };
  }
}
