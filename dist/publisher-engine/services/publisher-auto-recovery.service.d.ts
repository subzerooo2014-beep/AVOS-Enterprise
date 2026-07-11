import { PublisherJobRecoveryService } from "./publisher-job-recovery.service";
import { PublisherJobRetryPolicyService } from "./publisher-job-retry-policy.service";
export declare class PublisherAutoRecoveryService {
    private readonly recovery;
    private readonly retry;
    constructor(recovery: PublisherJobRecoveryService, retry: PublisherJobRetryPolicyService);
    recover(job: any): any;
}
