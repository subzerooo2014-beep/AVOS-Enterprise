import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import {
  AccessDecision,
  SecretRecord,
  SecurityControl,
} from "./foundation-ultra-pack-c.types";
import { FoundationUltraPackCFileStoreService } from "./foundation-ultra-pack-c-file-store.service";
import { GovernancePolicyRuntimeService } from "./governance-policy-runtime.service";

@Injectable()
export class SecurityFoundationService {
  constructor(
    private readonly store: FoundationUltraPackCFileStoreService,
    private readonly governance: GovernancePolicyRuntimeService,
  ) {
    this.seedControls();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seedControls(): void {
    if (this.listControls().length > 0) {
      return;
    }

    const seeds: Array<Omit<SecurityControl, "id" | "createdAt" | "updatedAt">> = [
      {
        code: "SEC-IDENTITY-001",
        name: "Strong Identity Verification",
        category: "identity",
        description: "All principals must have a traceable identity before access is evaluated.",
        mandatory: true,
        implementationStatus: "verified",
        owner: "AVOS Security",
        evidence: ["identity-registry", "audit-log"],
        jurisdictionScope: ["global"],
        version: "1.0.0",
      },
      {
        code: "SEC-ZT-001",
        name: "Explicit Zero Trust Decision",
        category: "zero-trust",
        description: "Every access decision must be explicitly evaluated using context and trust.",
        mandatory: true,
        implementationStatus: "verified",
        owner: "AVOS Security",
        evidence: ["zero-trust-decision-engine"],
        jurisdictionScope: ["global"],
        version: "1.0.0",
      },
      {
        code: "SEC-ENC-001",
        name: "Encryption at Rest and in Transit",
        category: "encryption",
        description: "Sensitive data and secrets require approved encryption.",
        mandatory: true,
        implementationStatus: "verified",
        owner: "AVOS Security",
        evidence: ["aes-256-gcm", "tls-policy"],
        jurisdictionScope: ["global"],
        version: "1.0.0",
      },
      {
        code: "SEC-SEC-001",
        name: "Secret Rotation",
        category: "secrets",
        description: "Secrets must be encrypted, versioned and rotated.",
        mandatory: true,
        implementationStatus: "verified",
        owner: "AVOS Security",
        evidence: ["secret-vault-runtime"],
        jurisdictionScope: ["global"],
        version: "1.0.0",
      },
      {
        code: "SEC-MON-001",
        name: "Security Audit Monitoring",
        category: "monitoring",
        description: "Security decisions and secret operations must remain auditable.",
        mandatory: true,
        implementationStatus: "verified",
        owner: "AVOS Security",
        evidence: ["security-audit"],
        jurisdictionScope: ["global"],
        version: "1.0.0",
      },
    ];

    for (const seed of seeds) {
      this.createControl(seed);
    }
  }

  createControl(
    input: Omit<SecurityControl, "id" | "createdAt" | "updatedAt">,
  ): SecurityControl {
    const existing = this.listControls().find(
      (control) =>
        control.code === input.code &&
        control.version === input.version,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: SecurityControl = {
      ...input,
      id: this.id("security-control"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(
      `security-controls/${record.id}.json`,
      record,
    );

    return record;
  }

  listControls(): SecurityControl[] {
    return this.store.listJson<SecurityControl>(
      "security-controls",
    );
  }

  decideAccess(input: {
    principalId: string;
    resourceId: string;
    action: string;
    trustScore: number;
    explicitlyEvaluated: boolean;
    context?: Record<string, unknown>;
  }): AccessDecision {
    const evaluation = this.governance.evaluate(
      "ZERO_TRUST_REQUIRED",
      `${input.principalId}:${input.resourceId}:${input.action}`,
      {
        explicitlyEvaluated: input.explicitlyEvaluated,
        trustScore: input.trustScore,
      },
    );

    const allowed = evaluation.passed;

    const decision: AccessDecision = {
      id: this.id("access-decision"),
      principalId: input.principalId,
      resourceId: input.resourceId,
      action: input.action,
      context: input.context ?? {},
      allowed,
      reason: allowed
        ? "Zero Trust policy satisfied."
        : evaluation.violations.join(" "),
      trustScore: input.trustScore,
      policyCodes: ["ZERO_TRUST_REQUIRED"],
      decidedAt: this.now(),
    };

    this.store.writeJson(
      `access-decisions/${decision.id}.json`,
      decision,
    );

    return decision;
  }

  listAccessDecisions(): AccessDecision[] {
    return this.store.listJson<AccessDecision>(
      "access-decisions",
    );
  }

  createSecret(input: {
    name: string;
    owner: string;
    value: string;
    keyReference: string;
    rotationIntervalDays: number;
  }): SecretRecord {
    if (!input.value) {
      throw new Error("Secret value is required.");
    }

    const now = new Date();
    const encryptedValue = this.encrypt(
      input.value,
      input.keyReference,
    );

    const record: SecretRecord = {
      id: this.id("secret"),
      name: input.name,
      owner: input.owner,
      encryptedValue,
      algorithm: "aes-256-gcm",
      keyReference: input.keyReference,
      rotationIntervalDays: input.rotationIntervalDays,
      lastRotatedAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() +
          input.rotationIntervalDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
      status: "active",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.store.writeJson(`secrets/${record.id}.json`, record);
    return record;
  }

  rotateSecret(
    secretId: string,
    newValue: string,
  ): SecretRecord {
    const current = this.listSecrets().find(
      (secret) => secret.id === secretId,
    );

    if (!current) {
      throw new Error(`Secret not found: ${secretId}`);
    }

    const now = new Date();
    const updated: SecretRecord = {
      ...current,
      encryptedValue: this.encrypt(
        newValue,
        current.keyReference,
      ),
      lastRotatedAt: now.toISOString(),
      expiresAt: new Date(
        now.getTime() +
          current.rotationIntervalDays *
            24 *
            60 *
            60 *
            1000,
      ).toISOString(),
      updatedAt: now.toISOString(),
    };

    this.store.writeJson(`secrets/${updated.id}.json`, updated);
    return updated;
  }

  listSecrets(): SecretRecord[] {
    return this.store.listJson<SecretRecord>("secrets");
  }

  private encrypt(
    value: string,
    keyReference: string,
  ): string {
    const key = crypto
      .createHash("sha256")
      .update(keyReference)
      .digest();

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      key,
      iv,
    );

    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
      iv.toString("base64"),
      authTag.toString("base64"),
      encrypted.toString("base64"),
    ].join(".");
  }
}