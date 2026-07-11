export interface GovernanceSignature {
    signature: string;
    algorithm: "HMAC-SHA256";
    keyId: string;
    signedAt: string;
}
