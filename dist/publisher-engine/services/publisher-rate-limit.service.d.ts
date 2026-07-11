export declare class PublisherRateLimitService {
    private readonly requests;
    allow(channel: string, limit?: number): boolean;
    reset(channel?: string): void;
    usage(): {
        [k: string]: number;
    };
}
