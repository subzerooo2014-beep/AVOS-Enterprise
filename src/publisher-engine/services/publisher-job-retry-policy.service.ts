import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobRetryPolicyService {
  canRetry(job: any) {
    return Number(job.retryCount ?? 0) < Number(job.maxRetries ?? 3);
  }

  nextStatus(job: any) {
    return this.canRetry(job) ? "queued" : "dead";
  }
}
