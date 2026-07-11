export declare class PublisherMemoryCacheService {
    private readonly data;
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
    size(): number;
}
