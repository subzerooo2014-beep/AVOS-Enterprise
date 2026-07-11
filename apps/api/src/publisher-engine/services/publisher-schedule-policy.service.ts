import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherSchedulePolicyService {
  ready(job: any) {
    if (!job?.scheduledAt) return true;

    return new Date(job.scheduledAt) <= new Date();
  }
}
