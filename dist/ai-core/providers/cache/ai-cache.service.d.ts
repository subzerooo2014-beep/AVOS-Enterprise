export declare class AiCacheService {
    private cache;
    set(key: string, value: any): void;
    get(key: string): any;
    has(key: string): boolean;
    clear(): void;
}
