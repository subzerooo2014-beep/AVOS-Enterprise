export declare class PublisherJobRetryPolicyService {
    canRetry(job: any): boolean;
    nextStatus(job: any): "queued" | "dead";
}
