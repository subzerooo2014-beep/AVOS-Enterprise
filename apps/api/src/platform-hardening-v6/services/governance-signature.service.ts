import { Injectable } from "@nestjs/common";
import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { GovernanceSignature } from "../interfaces/governance-signature.interface";

@Injectable()
export class GovernanceSignatureService {
  private readonly algorithm =
    "HMAC-SHA256" as const;

  private readonly keyId =
    process.env.AVOS_GOVERNANCE_SIGNING_KEY_ID ??
    "avos-governance-key-v1";

  private readonly signingSecret =
    process.env.AVOS_GOVERNANCE_SIGNING_SECRET ??
    "avos-dev-governance-signing-secret-change-in-production";

  signPayload(payload: unknown): GovernanceSignature {
    const signedAt =
      new Date().toISOString();

    const signature =
      this.createSignature(
        payload,
        signedAt,
      );

    return {
      signature,
      algorithm: this.algorithm,
      keyId: this.keyId,
      signedAt,
    };
  }

  verifyPayload(input: {
    payload: unknown;
    signature: string;
    signedAt: Date | string;
    algorithm?: string | null;
    keyId?: string | null;
  }): boolean {
    if (
      input.algorithm !== this.algorithm ||
      input.keyId !== this.keyId
    ) {
      return false;
    }

    const signedAt =
      input.signedAt instanceof Date
        ? input.signedAt.toISOString()
        : input.signedAt;

    const expected =
      this.createSignature(
        input.payload,
        signedAt,
      );

    const actualBuffer =
      Buffer.from(
        input.signature,
        "hex",
      );

    const expectedBuffer =
      Buffer.from(
        expected,
        "hex",
      );

    if (
      actualBuffer.length !==
      expectedBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(
      actualBuffer,
      expectedBuffer,
    );
  }

  getConfiguration() {
    return {
      algorithm: this.algorithm,
      keyId: this.keyId,
      secretConfigured:
        Boolean(this.signingSecret),
    };
  }

  private createSignature(
    payload: unknown,
    signedAt: string,
  ): string {
    return createHmac(
      "sha256",
      this.signingSecret,
    )
      .update(
        JSON.stringify({
          payload,
          signedAt,
          keyId: this.keyId,
          algorithm: this.algorithm,
        }),
      )
      .digest("hex");
  }
}
