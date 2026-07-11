import { Injectable } from "@nestjs/common";
import { PublisherJobRecoveryService } from "./publisher-job-recovery.service";
import { PublisherJobRetryPolicyService } from "./publisher-job-retry-policy.service";

@Injectable()
export class PublisherAutoRecoveryService {
  constructor(
    private readonly recovery: PublisherJobRecoveryService,
    private readonly retry: PublisherJobRetryPolicyService,
  ) {}

  recover(job: any) {
    if (!this.retry.canRetry(job)) {
      return {
        ...job,
        status: "dead",
      };
    }

    return this.recovery.recover(job);
  }
}
