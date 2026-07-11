import { ConnectorCredentialVaultService, ConnectorSecurityChannel } from "./connector-credential-vault.service";
export declare class ConnectorWebhookVerificationService {
    private readonly vault;
    constructor(vault: ConnectorCredentialVaultService);
    verify(input: {
        channel: ConnectorSecurityChannel;
        rawBody: string;
        signature: string;
    }): {
        valid: boolean;
        configured: boolean;
        reason: string;
        algorithm?: undefined;
    } | {
        valid: boolean;
        configured: boolean;
        algorithm: string;
        reason: string;
    };
    private normalizeSignature;
}
