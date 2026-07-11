import { GovernanceSignature } from "../interfaces/governance-signature.interface";
export declare class GovernanceSignatureService {
    private readonly algorithm;
    private readonly keyId;
    private readonly signingSecret;
    signPayload(payload: unknown): GovernanceSignature;
    verifyPayload(input: {
        payload: unknown;
        signature: string;
        signedAt: Date | string;
        algorithm?: string | null;
        keyId?: string | null;
    }): boolean;
    getConfiguration(): {
        algorithm: "HMAC-SHA256";
        keyId: string;
        secretConfigured: boolean;
    };
    private createSignature;
}
