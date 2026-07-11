import { PublisherRegistryService } from "../publisher-registry.service";
export declare class PublisherChannelService {
    private readonly registry;
    constructor(registry: PublisherRegistryService);
    all(): string[];
    resolve(channel?: string | null): string;
    adapter(channel?: string | null): import("../publisher-registry.service").PublisherAdapter;
    exists(channel?: string | null): boolean;
}
