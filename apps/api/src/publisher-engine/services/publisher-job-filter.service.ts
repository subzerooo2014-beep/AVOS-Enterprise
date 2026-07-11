import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobFilterService {
  queued(jobs: any[]) {
    return jobs.filter((x) => x.status === "queued");
  }

  failed(jobs: any[]) {
    return jobs.filter((x) => x.status === "failed");
  }

  published(jobs: any[]) {
    return jobs.filter((x) => x.status === "published");
  }

  processing(jobs: any[]) {
    return jobs.filter((x) => x.status === "processing");
  }
}
