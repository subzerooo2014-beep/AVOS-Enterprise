import { Injectable } from "@nestjs/common";
import {
  TrustEvidence,
  TrustProfile,
} from "./foundation-ultra-pack-e.types";
import { FoundationUltraPackEFileStoreService } from "./foundation-ultra-pack-e-file-store.service";

@Injectable()
export class TrustIntelligenceService {
  constructor(
    private readonly store: FoundationUltraPackEFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  addEvidence(
    input: Omit<TrustEvidence, "id" | "collectedAt">,
  ): TrustEvidence {
    const evidence: TrustEvidence = {
      ...input,
      id: this.id("trust-evidence"),
      weight: Math.max(0, Math.min(100, input.weight)),
      collectedAt: this.now(),
    };

    this.store.writeJson(`trust-evidence/${evidence.id}.json`, evidence);
    return evidence;
  }

  listEvidence(subjectId?: string): TrustEvidence[] {
    const evidence = this.store.listJson<TrustEvidence>("trust-evidence");
    return subjectId
      ? evidence.filter((item) => item.subjectId === subjectId)
      : evidence;
  }

  calculateProfile(subjectId: string): TrustProfile {
    const evidence = this.listEvidence(subjectId);
    const validEvidence = evidence.filter((item) => item.valid);

    const trustScore =
      validEvidence.length === 0
        ? 0
        : Math.round(
            validEvidence.reduce((sum, item) => sum + item.weight, 0) /
              validEvidence.length,
          );

    const level: TrustProfile["level"] =
      trustScore >= 90
        ? "excellent"
        : trustScore >= 75
          ? "high"
          : trustScore >= 50
            ? "medium"
            : "low";

    const explanations = [
      `Valid evidence count: ${validEvidence.length}`,
      `Invalid evidence count: ${evidence.length - validEvidence.length}`,
      `Calculated trust score: ${trustScore}`,
      ...Array.from(
        new Set(
          validEvidence.map(
            (item) => `${item.evidenceType} evidence verified from ${item.source}`,
          ),
        ),
      ),
    ];

    const profile: TrustProfile = {
      id: this.id("trust-profile"),
      subjectId,
      trustScore,
      level,
      evidenceIds: validEvidence.map((item) => item.id),
      explanations,
      updatedAt: this.now(),
    };

    this.store.writeJson(`trust-profiles/${profile.id}.json`, profile);
    this.store.writeJson(`trust-profiles-latest/${subjectId}.json`, profile);

    return profile;
  }

  latestProfile(subjectId: string): TrustProfile | null {
    return this.store.readJson<TrustProfile | null>(
      `trust-profiles-latest/${subjectId}.json`,
      null,
    );
  }

  listProfiles(): TrustProfile[] {
    return this.store.listJson<TrustProfile>("trust-profiles");
  }
}