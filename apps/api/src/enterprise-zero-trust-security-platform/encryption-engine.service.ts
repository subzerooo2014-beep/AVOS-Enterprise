import { Injectable } from "@nestjs/common";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";
import { KeyManagementService } from "./key-management.service";

@Injectable()
export class EncryptionEngineService {
  constructor(private readonly keys: KeyManagementService) {}

  encrypt(keyId: string, plaintext: string) {
    const key = this.deriveKey(this.keys.material(keyId));
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return {
      algorithm: "AES-256-GCM",
      keyId,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      ciphertext: ciphertext.toString("hex"),
    };
  }

  decrypt(
    keyId: string,
    payload: { iv: string; tag: string; ciphertext: string },
  ): string {
    const key = this.deriveKey(this.keys.material(keyId));
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(payload.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

    return Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, "hex")),
      decipher.final(),
    ]).toString("utf8");
  }

  private deriveKey(material: string): Buffer {
    return createHash("sha256").update(material).digest();
  }
}
