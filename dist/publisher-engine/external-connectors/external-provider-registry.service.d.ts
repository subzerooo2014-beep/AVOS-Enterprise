import { ExternalProvider, ExternalProviderChannel } from "./external-provider.interface";
import { InstagramApiService } from "./instagram/instagram-api.service";
import { TikTokApiService } from "./tiktok/tiktok-api.service";
import { GoogleAdsApiService } from "./google/google-ads-api.service";
export declare class ExternalProviderRegistryService {
    private readonly logger;
    private readonly providers;
    constructor(instagram: InstagramApiService, tiktok: TikTokApiService, googleSearch: GoogleAdsApiService);
    get(channel: ExternalProviderChannel): ExternalProvider;
    list(): Array<{
        channel: ExternalProviderChannel;
        configured: boolean;
    }>;
    health(): Promise<any[]>;
}
