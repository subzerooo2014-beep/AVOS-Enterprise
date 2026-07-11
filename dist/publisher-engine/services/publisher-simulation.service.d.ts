import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";
export declare class PublisherSimulationService {
    private readonly registry;
    private readonly contextBuilder;
    constructor(registry: PublisherRegistryService, contextBuilder: PublisherContextBuilderService);
    simulate(input: any): Promise<{
        success: boolean;
        simulation: boolean;
        channelExists: boolean;
        health: import("../publisher-registry.service").PublisherStatus;
        context: import("../publisher-registry.service").PublisherContext;
        estimatedResult: {
            status: string;
            channel: string;
            externalId: string;
            message: string;
        };
    }>;
}
