import { Logger } from "@nestjs/common";
import { ExternalProvider, ExternalProviderChannel, ExternalProviderRequest, ExternalProviderResponse } from "./external-provider.interface";
export declare abstract class BaseExternalHttpProvider implements ExternalProvider {
    abstract readonly channel: ExternalProviderChannel;
    protected abstract readonly logger: Logger;
    protected abstract endpoint(): string | null;
    protected abstract accessToken(): string | null;
    protected abstract accountId(): string | null;
    configured(): boolean;
    health(): Promise<{
        channel: ExternalProviderChannel;
        configured: boolean;
        status: "healthy" | "unconfigured" | "degraded";
    }>;
    deliver(request: ExternalProviderRequest): Promise<ExternalProviderResponse>;
    protected buildRequestBody(request: ExternalProviderRequest, accountId: string | null): any;
    private timeoutMs;
    private parseResponse;
    private externalId;
    private safeString;
}
