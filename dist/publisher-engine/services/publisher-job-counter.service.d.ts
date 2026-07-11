export declare class PublisherJobCounterService {
    count(jobs: any[]): {
        total: number;
        queued: number;
        processing: number;
        published: number;
        failed: number;
        dead: number;
        skipped: number;
    };
}
