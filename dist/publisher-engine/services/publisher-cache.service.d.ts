export declare class PublisherCacheService {
    private readonly cache;
    get(key: string): any;
    set(key: string, value: any): any;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    stats(): {
        keys: number;
    };
}
