import { ConnectorSecurityChannel } from "./connector-credential-vault.service";
export declare class ConnectorRateLimiterService {
    private readonly buckets;
    private readonly windowMs;
    private readonly limit;
    consume(channel: ConnectorSecurityChannel, identity?: string): {
        allowed: boolean;
        channel: ConnectorSecurityChannel;
        identity: string;
        limit: number;
        remaining: number;
        resetAt: Date;
    };
    status(): {
        windowMs: number;
        limit: number;
        activeBuckets: number;
    };
    private positiveInteger;
}
