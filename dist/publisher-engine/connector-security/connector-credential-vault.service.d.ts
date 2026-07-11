export type ConnectorSecurityChannel = "instagram" | "tiktok" | "google_search";
export interface ConnectorCredentialSnapshot {
    channel: ConnectorSecurityChannel;
    configured: boolean;
    endpointConfigured: boolean;
    tokenConfigured: boolean;
    accountConfigured: boolean;
    webhookSecretConfigured: boolean;
}
export declare class ConnectorCredentialVaultService {
    snapshot(channel: ConnectorSecurityChannel): ConnectorCredentialSnapshot;
    allSnapshots(): ConnectorCredentialSnapshot[];
    endpoint(channel: ConnectorSecurityChannel): string | null;
    accessToken(channel: ConnectorSecurityChannel): string | null;
    accountId(channel: ConnectorSecurityChannel): string | null;
    webhookSecret(channel: ConnectorSecurityChannel): string | null;
    requireAccessToken(channel: ConnectorSecurityChannel): string;
    requireAccountId(channel: ConnectorSecurityChannel): string;
    private value;
}
