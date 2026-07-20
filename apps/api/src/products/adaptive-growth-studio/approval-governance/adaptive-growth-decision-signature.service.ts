import { Injectable } from "@nestjs/common";
import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto";

@Injectable()
export class AdaptiveGrowthDecisionSignatureService {
  private readonly algorithm = "hmac-sha256";

  sign(payload: Record<string, unknown>) {
    const canonical = JSON.stringify(payload);
    const decisionHash = createHash("sha256")
      .update(canonical)
      .digest("hex");

    const secret =
      process.env.AVOS_DECISION_SIGNING_SECRET ??
      "AVOS-DEVELOPMENT-DECISION-SIGNING-KEY";

    const signature = createHmac(
      "sha256",
      secret,
    )
      .update(decisionHash)
      .digest("hex");

    return {
      decisionHash,
      signature,
      signatureAlgorithm: this.algorithm,
    };
  }

  verify(
    payload: Record<string, unknown>,
    decisionHash: string,
    signature: string,
  ): boolean {
    const generated = this.sign(payload);

    if (
      generated.decisionHash !==
      decisionHash
    ) {
      return false;
    }

    const left = Buffer.from(
      generated.signature,
      "hex",
    );
    const right = Buffer.from(
      signature,
      "hex",
    );

    return (
      left.length === right.length &&
      timingSafeEqual(left, right)
    );
  }

  status() {
    return {
      status: "operational",
      algorithm: this.algorithm,
      integrityProtected: true,
      productionSecretConfigured:
        Boolean(
          process.env
            .AVOS_DECISION_SIGNING_SECRET,
        ),
    };
  }
}