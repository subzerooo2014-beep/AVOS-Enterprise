import { ExternalProviderChannel, ExternalProviderRequest } from "./external-provider.interface";
import { ExternalProviderRegistryService } from "./external-provider-registry.service";
export declare class ExternalDeliveryService {
    private readonly registry;
    constructor(registry: ExternalProviderRegistryService);
    deliver(request: ExternalProviderRequest): Promise<import("./external-provider.interface").ExternalProviderResponse>;
    providers(): {
        channel: ExternalProviderChannel;
        configured: boolean;
    }[];
    health(): Promise<any[]>;
    configured(channel: ExternalProviderChannel): boolean;
}
