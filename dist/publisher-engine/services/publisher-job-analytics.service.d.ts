export declare class PublisherJobAnalyticsService {
    analyze(jobs: any[]): {
        total: number;
        published: number;
        failed: number;
        queued: number;
        processing: number;
        skipped: number;
        dead: number;
    };
}
