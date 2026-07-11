export declare class PublisherQueueProfilerService {
    profile(jobs: any[]): {
        total: number;
        queued: number;
        processing: number;
        published: number;
        failed: number;
        generatedAt: Date;
    };
}
