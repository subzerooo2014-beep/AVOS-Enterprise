import { Injectable } from "@nestjs/common";
import { PublisherJobExpirationService } from "./publisher-job-expiration.service";

@Injectable()
export class PublisherJobGarbageCollectorService {
  collect(jobs: any[]) {
    return jobs.filter(
      (job) => !this.expired(job),
    );
  }

  private expired(job: any) {
    return new PublisherJobExpirationService(
      new (class {
        age(item: any) {
          return Date.now() - new Date(item.createdAt).getTime();
        }
      })() as any,
    ).expired(job);
  }
}
