export declare class CacheService {
    private cache;
    get(key: string): any;
    set(key: string, value: any): any;
    delete(key: string): boolean;
    clear(): void;
}
