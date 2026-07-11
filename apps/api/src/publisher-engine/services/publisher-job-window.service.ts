import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobWindowService {
  active(job: any) {
    if (!job?.scheduledAt) return true;

    return new Date(job.scheduledAt) <= new Date();
  }
}
