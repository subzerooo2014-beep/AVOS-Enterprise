import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherQueueProfilerService {
  profile(jobs: any[]) {
    return {
      total: jobs.length,
      queued: jobs.filter(j => j.status === "queued").length,
      processing: jobs.filter(j => j.status === "processing").length,
      published: jobs.filter(j => j.status === "published").length,
      failed: jobs.filter(j => j.status === "failed").length,
      generatedAt: new Date(),
    };
  }
}
