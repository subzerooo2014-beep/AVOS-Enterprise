import { PublisherFallbackService } from "./publisher-fallback.service";
export declare class PublisherFailoverService {
    private readonly fallback;
    constructor(fallback: PublisherFallbackService);
    adapter(channel?: string | null): import("..").PublisherAdapter;
}
