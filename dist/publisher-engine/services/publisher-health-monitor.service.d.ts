import { PublisherRegistryService } from "../publisher-registry.service";
export declare class PublisherHealthMonitorService {
    private readonly registry;
    constructor(registry: PublisherRegistryService);
    status(): Promise<{
        success: boolean;
        engine: string;
        channels: {
            channel: string;
            status: import("../publisher-registry.service").PublisherStatus;
        }[];
        checkedAt: Date;
    }>;
}
