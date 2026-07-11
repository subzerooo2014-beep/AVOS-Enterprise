export declare class PublisherJobHealthService {
    check(job: any): {
        healthy: boolean;
        status: any;
        retries: any;
        locked: boolean;
        generatedAt: Date;
    };
}
