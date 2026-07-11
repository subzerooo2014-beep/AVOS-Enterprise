import { SocialDeliveryChannel, SocialProviderConfiguration } from "./social-delivery.contracts";
export declare class SocialProviderConfigurationService {
    get(channel: SocialDeliveryChannel): SocialProviderConfiguration;
    all(): SocialProviderConfiguration[];
    private configuration;
    private positiveInteger;
}
