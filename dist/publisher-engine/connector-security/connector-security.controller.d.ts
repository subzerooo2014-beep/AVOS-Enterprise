import { ConnectorCredentialVaultService, ConnectorSecurityChannel } from "./connector-credential-vault.service";
import { ConnectorOAuthStateService } from "./connector-oauth-state.service";
import { ConnectorRateLimiterService } from "./connector-rate-limiter.service";
import { ConnectorWebhookVerificationService } from "./connector-webhook-verification.service";
export declare class ConnectorSecurityController {
    private readonly vault;
    private readonly oauthStates;
    private readonly rateLimiter;
    private readonly webhooks;
    constructor(vault: ConnectorCredentialVaultService, oauthStates: ConnectorOAuthStateService, rateLimiter: ConnectorRateLimiterService, webhooks: ConnectorWebhookVerificationService);
    status(): {
        success: boolean;
        credentials: import("./connector-credential-vault.service").ConnectorCredentialSnapshot[];
        configuredCount: number;
        oauth: {
            activeStates: number;
            ttlMs: number;
        };
        rateLimiter: {
            windowMs: number;
            limit: number;
            activeBuckets: number;
        };
        generatedAt: Date;
    };
    createOAuthState(channel: string, body: {
        redirectUri?: string;
    }): {
        state: string;
        channel: ConnectorSecurityChannel;
        redirectUri: string;
        expiresAt: Date;
    };
    consumeOAuthState(channel: string, body: {
        state?: string;
    }): {
        valid: boolean;
        channel: ConnectorSecurityChannel;
        redirectUri: string;
        createdAt: Date;
    };
    rateLimit(channel: string, body: {
        identity?: string;
    }): {
        allowed: boolean;
        channel: ConnectorSecurityChannel;
        identity: string;
        limit: number;
        remaining: number;
        resetAt: Date;
    };
    verifyWebhook(channel: string, body: {
        rawBody?: string;
        signature?: string;
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
    private channel;
}
