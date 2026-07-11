export declare class PublisherJobCacheService {
    private readonly cache;
    put(id: string, value: any): void;
    get(id: string): any;
    remove(id: string): void;
    clear(): void;
}
