import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherDispatchPolicyService {
  allow(job: any) {
    if (job.status !== "queued") {
      return false;
    }

    if (job.scheduledAt && new Date(job.scheduledAt) > new Date()) {
      return false;
    }

    return true;
  }
}
