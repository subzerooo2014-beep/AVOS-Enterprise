import { PrismaService } from "../prisma/prisma.service";
import { PublisherRegistryService } from "./publisher-registry.service";
import { PublisherDispatcherService } from "./publisher-dispatcher.service";
export declare class PublisherRuntimeController {
    private readonly prisma;
    private readonly registry;
    private readonly dispatcher;
    constructor(prisma: PrismaService, registry: PublisherRegistryService, dispatcher: PublisherDispatcherService);
    channels(): {
        success: boolean;
        version: string;
        count: number;
        channels: string[];
        registrations: import("./publisher-registry.service").RegisteredPublisherMetadata[];
        generatedAt: Date;
    };
    health(): Promise<import("./publisher-dispatcher.service").PublisherDispatcherHealth>;
    publish(body: any): Promise<{
        success: boolean;
        job: any;
        createdAt: Date;
    }>;
    job(id: string): Promise<{
        success: boolean;
        job: any;
    }>;
    dispatchOne(id: string): Promise<unknown>;
    dispatchQueued(limit?: string): Promise<import("./publisher-dispatcher.service").PublisherDispatchBatchResult>;
    private requiredText;
    private optionalText;
    private normalizePriority;
    private normalizeMaxRetries;
    private normalizeLimit;
}
