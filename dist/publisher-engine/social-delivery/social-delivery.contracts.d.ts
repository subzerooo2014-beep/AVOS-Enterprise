export type SocialDeliveryChannel = "instagram" | "tiktok" | "google_search";
export type SocialDeliveryStatus = "queued" | "processing" | "awaiting_credentials" | "retrying" | "delivered" | "dead";
export interface SocialProviderConfiguration {
    channel: SocialDeliveryChannel;
    endpoint: string | null;
    accessToken: string | null;
    accountId: string | null;
    timeoutMs: number;
    configured: boolean;
}
export interface SocialDeliveryResult {
    success: boolean;
    channel: SocialDeliveryChannel;
    eventId: string;
    status: SocialDeliveryStatus;
    attempt: number;
    externalId?: string | null;
    message: string;
    response?: any;
    completedAt: Date;
}
