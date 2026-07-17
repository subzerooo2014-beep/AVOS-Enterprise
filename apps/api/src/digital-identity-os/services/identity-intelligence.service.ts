import { Injectable } from "@nestjs/common";
import { DigitalIdentityRecord } from "../contracts/digital-identity.contracts";
import { IdentityRegistryService } from "./identity-registry.service";

@Injectable()
export class IdentityIntelligenceService {
  constructor(private readonly registry: IdentityRegistryService) {}

  duplicateCandidates(): readonly { readonly first: DigitalIdentityRecord; readonly second: DigitalIdentityRecord; readonly score: number }[] {
    const identities = this.registry.list().filter((item) => item.status !== "merged");
    const results: Array<{ first: DigitalIdentityRecord; second: DigitalIdentityRecord; score: number }> = [];
    for (let i = 0; i < identities.length; i += 1) {
      for (let j = i + 1; j < identities.length; j += 1) {
        const first = identities[i];
        const second = identities[j];
        if (!first || !second || first.kind !== second.kind) continue;
        const score = this.similarity(first.displayName, second.displayName);
        if (score >= 0.75) results.push({ first, second, score });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 50);
  }

  analytics(): Readonly<Record<string, unknown>> {
    const identities = this.registry.list();
    const byKind = identities.reduce<Record<string, number>>((acc, item) => { acc[item.kind] = (acc[item.kind] ?? 0) + 1; return acc; }, {});
    const averageTrustScore = identities.length === 0 ? 0 : identities.reduce((sum, item) => sum + item.trustScore, 0) / identities.length;
    return {
      total: identities.length,
      active: identities.filter((item) => item.status === "active").length,
      verified: identities.filter((item) => item.verificationStatus === "verified").length,
      averageTrustScore: Number(averageTrustScore.toFixed(2)),
      byKind,
      duplicateCandidates: this.duplicateCandidates().length,
      generatedAt: new Date().toISOString(),
    };
  }

  private similarity(first: string, second: string): number {
    const a = first.trim().toLowerCase();
    const b = second.trim().toLowerCase();
    if (a === b) return 1;
    const left = new Set(a.split(/\s+/));
    const right = new Set(b.split(/\s+/));
    const intersection = [...left].filter((value) => right.has(value)).length;
    const union = new Set([...left, ...right]).size;
    return union === 0 ? 0 : intersection / union;
  }
}
