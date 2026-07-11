export declare class PublisherRetryPolicy {
    static shouldRetry(job: any): boolean;
    static nextStatus(job: any): "queued" | "dead";
}
