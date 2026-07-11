import { ConnectorSecurityChannel } from "./connector-credential-vault.service";
export declare class ConnectorOAuthStateService {
    private readonly states;
    private readonly ttlMs;
    create(input: {
        channel: ConnectorSecurityChannel;
        redirectUri: string;
    }): {
        state: string;
        channel: ConnectorSecurityChannel;
        redirectUri: string;
        expiresAt: Date;
    };
    consume(state: string, channel: ConnectorSecurityChannel): {
        valid: boolean;
        channel: ConnectorSecurityChannel;
        redirectUri: string;
        createdAt: Date;
    };
    status(): {
        activeStates: number;
        ttlMs: number;
    };
    private cleanup;
    private positiveInteger;
}
