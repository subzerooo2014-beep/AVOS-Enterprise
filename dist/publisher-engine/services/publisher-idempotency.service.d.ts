export declare class PublisherIdempotencyService {
    private readonly executed;
    executedBefore(id: string): boolean;
    mark(id: string): void;
    clear(): void;
    count(): number;
}
