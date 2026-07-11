import { PublisherRegistryService } from "../publisher-registry.service";
export declare class PublisherFallbackService {
    private readonly registry;
    constructor(registry: PublisherRegistryService);
    adapter(channel?: string | null): import("../publisher-registry.service").PublisherAdapter;
}
