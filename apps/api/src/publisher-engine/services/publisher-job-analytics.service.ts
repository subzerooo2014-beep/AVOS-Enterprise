import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobAnalyticsService {
  analyze(jobs: any[]) {
    const analytics = {
      total: jobs.length,
      published: 0,
      failed: 0,
      queued: 0,
      processing: 0,
      skipped: 0,
      dead: 0,
    };

    for (const job of jobs) {
      switch (job.status) {
        case "published":
          analytics.published++;
          break;
        case "failed":
          analytics.failed++;
          break;
        case "queued":
          analytics.queued++;
          break;
        case "processing":
          analytics.processing++;
          break;
        case "skipped":
          analytics.skipped++;
          break;
        case "dead":
          analytics.dead++;
          break;
      }
    }

    return analytics;
  }
}
