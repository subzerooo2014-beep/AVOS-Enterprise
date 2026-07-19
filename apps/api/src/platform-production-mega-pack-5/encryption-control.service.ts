import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { EncryptionRecord } from "./platform-production-mega-pack-5.types";
import { PlatformSecurityFileStoreService } from "./platform-security-file-store.service";

@Injectable()
export class EncryptionControlService {
  private readonly masterKey = createHash("sha256")
    .update("AVOS-PPI-MP5-LOCAL-ENCRYPTION-ROOT")
    .digest();

  constructor(
    private readonly store: PlatformSecurityFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const record: EncryptionRecord = {
      id: this.id("encryption-key"),
      algorithm: "aes-256-gcm",
      keyId: "platform-security-master-v1",
      purpose: "platform-secrets",
      status: "active",
      createdAt: this.now(),
    };

    this.store.writeJson(`encryption/${record.id}.json`, record);
  }

  encrypt(value: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.masterKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
      iv.toString("base64"),
      tag.toString("base64"),
      encrypted.toString("base64"),
    ].join(".");
  }

  decrypt(value: string): string {
    const [ivPart, tagPart, encryptedPart] = value.split(".");
    const decipher = createDecipheriv(
      "aes-256-gcm",
      this.masterKey,
      Buffer.from(ivPart, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tagPart, "base64"));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, "base64")),
      decipher.final(),
    ]).toString("utf8");
  }

  list(): EncryptionRecord[] {
    return this.store.listJson<EncryptionRecord>("encryption");
  }
}