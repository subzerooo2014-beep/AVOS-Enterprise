export declare class PublisherJobDeduplicationService {
    private readonly keys;
    exists(key: string): boolean;
    register(key: string): void;
    remove(key: string): void;
    clear(): void;
}
