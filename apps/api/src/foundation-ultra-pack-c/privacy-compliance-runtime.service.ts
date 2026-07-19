import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import {
  ComplianceEvidence,
  PrivacyConsent,
  PrivacyRequest,
} from "./foundation-ultra-pack-c.types";
import { FoundationUltraPackCFileStoreService } from "./foundation-ultra-pack-c-file-store.service";
import { GovernancePolicyRuntimeService } from "./governance-policy-runtime.service";

@Injectable()
export class PrivacyComplianceRuntimeService {
  constructor(
    private readonly store: FoundationUltraPackCFileStoreService,
    private readonly governance: GovernancePolicyRuntimeService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  recordConsent(
    input: Omit<
      PrivacyConsent,
      "id" | "createdAt" | "updatedAt" | "grantedAt" | "revokedAt"
    >,
  ): PrivacyConsent {
    const timestamp = this.now();

    const record: PrivacyConsent = {
      ...input,
      id: this.id("consent"),
      grantedAt: input.granted ? timestamp : undefined,
      revokedAt: input.granted ? undefined : timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`consents/${record.id}.json`, record);
    return record;
  }

  revokeConsent(
    consentId: string,
  ): PrivacyConsent {
    const current = this.listConsents().find(
      (consent) => consent.id === consentId,
    );

    if (!current) {
      throw new Error(`Consent not found: ${consentId}`);
    }

    const updated: PrivacyConsent = {
      ...current,
      granted: false,
      revokedAt: this.now(),
      updatedAt: this.now(),
    };

    this.store.writeJson(`consents/${updated.id}.json`, updated);
    return updated;
  }

  listConsents(): PrivacyConsent[] {
    return this.store.listJson<PrivacyConsent>("consents");
  }

  evaluateProcessing(input: {
    subjectId: string;
    purpose: string;
    jurisdiction: string;
    dataCategories: string[];
    lawfulBasisDeclared: boolean;
    purposeDeclared: boolean;
    dataMinimized: boolean;
  }): {
    allowed: boolean;
    policyEvaluationId: string;
    consentFound: boolean;
    violations: string[];
  } {
    const policy = this.governance.evaluate(
      "PRIVACY_BY_DESIGN",
      `${input.subjectId}:${input.purpose}`,
      {
        lawfulBasisDeclared: input.lawfulBasisDeclared,
        purposeDeclared: input.purposeDeclared,
        dataMinimized: input.dataMinimized,
      },
    );

    const consentFound = this.listConsents().some(
      (consent) =>
        consent.subjectId === input.subjectId &&
        consent.purpose === input.purpose &&
        consent.jurisdiction === input.jurisdiction &&
        consent.granted,
    );

    const requiresConsent =
      input.dataCategories.includes("personal") ||
      input.dataCategories.includes("sensitive");

    const violations = [...policy.violations];

    if (requiresConsent && !consentFound) {
      violations.push(
        "Active consent is required for the requested processing.",
      );
    }

    return {
      allowed:
        policy.passed &&
        (!requiresConsent || consentFound),
      policyEvaluationId: policy.id,
      consentFound,
      violations,
    };
  }

  createPrivacyRequest(input: {
    subjectId: string;
    requestType: PrivacyRequest["requestType"];
    jurisdiction: string;
    dueInDays?: number;
  }): PrivacyRequest {
    const now = new Date();
    const dueInDays = input.dueInDays ?? 30;

    const record: PrivacyRequest = {
      id: this.id("privacy-request"),
      subjectId: input.subjectId,
      requestType: input.requestType,
      jurisdiction: input.jurisdiction,
      status: "received",
      dueAt: new Date(
        now.getTime() + dueInDays * 24 * 60 * 60 * 1000,
      ).toISOString(),
      evidence: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.store.writeJson(
      `privacy-requests/${record.id}.json`,
      record,
    );

    return record;
  }

  completePrivacyRequest(
    requestId: string,
    evidence: string[],
  ): PrivacyRequest {
    const current = this.listPrivacyRequests().find(
      (request) => request.id === requestId,
    );

    if (!current) {
      throw new Error(`Privacy request not found: ${requestId}`);
    }

    const updated: PrivacyRequest = {
      ...current,
      status: "completed",
      evidence,
      updatedAt: this.now(),
    };

    this.store.writeJson(
      `privacy-requests/${updated.id}.json`,
      updated,
    );

    return updated;
  }

  listPrivacyRequests(): PrivacyRequest[] {
    return this.store.listJson<PrivacyRequest>(
      "privacy-requests",
    );
  }

  collectEvidence(input: {
    controlCode: string;
    jurisdiction: string;
    artifactType: string;
    artifactReference: string;
    collectedBy: string;
    validUntil?: string;
  }): ComplianceEvidence {
    const hash = crypto
      .createHash("sha256")
      .update(
        `${input.controlCode}|${input.jurisdiction}|${input.artifactType}|${input.artifactReference}`,
      )
      .digest("hex");

    const record: ComplianceEvidence = {
      id: this.id("evidence"),
      controlCode: input.controlCode,
      jurisdiction: input.jurisdiction,
      artifactType: input.artifactType,
      artifactReference: input.artifactReference,
      hash,
      collectedBy: input.collectedBy,
      collectedAt: this.now(),
      validUntil: input.validUntil,
    };

    this.store.writeJson(
      `compliance-evidence/${record.id}.json`,
      record,
    );

    return record;
  }

  listEvidence(): ComplianceEvidence[] {
    return this.store.listJson<ComplianceEvidence>(
      "compliance-evidence",
    );
  }
}