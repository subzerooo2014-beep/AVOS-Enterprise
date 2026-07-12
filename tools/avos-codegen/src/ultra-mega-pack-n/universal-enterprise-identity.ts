import { createHash, randomUUID } from "node:crypto";
import { UltraNEvidence, UltraNValue } from "./contracts";

export interface EnterpriseIdentityClaim {
  key: string;
  issuer: string;
  subject: string;
  confidence: number;
  attributes: Record<string, UltraNValue>;
}

export interface UniversalEnterpriseIdentityResult {
  identityId: string;
  identityHash: string;
  verified: boolean;
  confidenceScore: number;
  claims: number;
  issuers: string[];
  evidence: UltraNEvidence[];
  verifiedAt: string;
}

export class UniversalEnterpriseIdentity {
  verify(
    systemKey: string,
    claims: readonly EnterpriseIdentityClaim[],
  ): UniversalEnterpriseIdentityResult {
    const confidenceScore =
      claims.length === 0
        ? 0
        : Math.round(
            claims.reduce((sum, claim) => sum + claim.confidence, 0) /
              claims.length,
          );

    const issuers = Array.from(new Set(claims.map((claim) => claim.issuer))).sort();

    const identityHash = createHash("sha256")
      .update(
        JSON.stringify(
          claims.map((claim) => ({
            key: claim.key,
            issuer: claim.issuer,
            subject: claim.subject,
            attributes: claim.attributes,
          })),
        ),
      )
      .digest("hex");

    const verified = claims.length > 0 && confidenceScore >= 80 && issuers.length >= 2;

    return {
      identityId: randomUUID(),
      identityHash,
      verified,
      confidenceScore,
      claims: claims.length,
      issuers,
      evidence: [
        {
          id: randomUUID(),
          systemKey,
          category: "universal-enterprise-identity",
          action: "identity.verified",
          message: `Enterprise identity verification completed with score ${confidenceScore}.`,
          metadata: {
            verified,
            claims: claims.length,
            issuers,
            identityHash,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      verifiedAt: new Date().toISOString(),
    };
  }
}
