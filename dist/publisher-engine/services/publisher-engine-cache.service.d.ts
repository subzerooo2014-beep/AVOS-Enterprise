import { PublisherMemoryCacheService } from "./publisher-memory-cache.service";
export declare class PublisherEngineCacheService {
    private readonly cache;
    constructor(cache: PublisherMemoryCacheService);
    remember(key: string, value: any): any;
    recall(key: string): any;
    forget(key: string): void;
    flush(): void;
}
