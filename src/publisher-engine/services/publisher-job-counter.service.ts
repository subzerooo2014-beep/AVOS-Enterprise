import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobCounterService {
  count(jobs: any[]) {
    return {
      total: jobs.length,
      queued: jobs.filter(j => j.status === "queued").length,
      processing: jobs.filter(j => j.status === "processing").length,
      published: jobs.filter(j => j.status === "published").length,
      failed: jobs.filter(j => j.status === "failed").length,
      dead: jobs.filter(j => j.status === "dead").length,
      skipped: jobs.filter(j => j.status === "skipped").length,
    };
  }
}
