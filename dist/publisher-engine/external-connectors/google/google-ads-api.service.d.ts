import { Logger } from "@nestjs/common";
import { BaseExternalHttpProvider } from "../base-external-http-provider";
export declare class GoogleAdsApiService extends BaseExternalHttpProvider {
    readonly channel: "google_search";
    protected readonly logger: Logger;
    protected endpoint(): string | null;
    protected accessToken(): string | null;
    protected accountId(): string | null;
    protected buildRequestBody(request: any, accountId: string | null): any;
}
