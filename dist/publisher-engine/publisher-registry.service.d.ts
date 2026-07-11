import { OnApplicationShutdown } from "@nestjs/common";
import { PublisherAdapter, PublisherStatus } from "./contracts/publisher.types";
export { PublisherAdapter, PublisherContext, PublisherResult, PublisherStatus, } from "./contracts/publisher.types";
export interface RegisteredPublisherMetadata {
    channel: string;
    aliases: string[];
    displayName: string;
    registeredAt: Date;
}
export declare class PublisherRegistryService implements OnApplicationShutdown {
    private readonly logger;
    private readonly adapters;
    private readonly aliases;
    private readonly metadata;
    register(adapter: PublisherAdapter, options?: {
        aliases?: string[];
        displayName?: string;
        replace?: boolean;
    }): PublisherAdapter;
    registerMany(adapters: readonly PublisherAdapter[]): PublisherAdapter[];
    unregister(channelOrAlias: string): boolean;
    get(channelOrAlias: string): PublisherAdapter;
    find(channelOrAlias: string): PublisherAdapter | undefined;
    exists(channelOrAlias: string): boolean;
    has(channelOrAlias: string): boolean;
    list(): string[];
    listMetadata(): RegisteredPublisherMetadata[];
    count(): number;
    health(): Promise<Array<{
        channel: string;
        status: PublisherStatus;
        error?: string;
    }>>;
    onApplicationShutdown(): Promise<void>;
    private resolveChannel;
    private normalizeChannel;
    private validateAdapter;
    private errorMessage;
}
