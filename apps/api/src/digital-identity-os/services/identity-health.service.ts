import { Injectable } from "@nestjs/common";
import { IdentityHealthReport } from "../contracts/digital-identity.contracts";
import { IdentityGraphService } from "./identity-graph.service";
import { IdentityIntelligenceService } from "./identity-intelligence.service";
import { IdentityRegistryService } from "./identity-registry.service";

@Injectable()
export class IdentityHealthService {
  constructor(private readonly registry: IdentityRegistryService, private readonly graph: IdentityGraphService, private readonly intelligence: IdentityIntelligenceService) {}

  report(): IdentityHealthReport {
    const identities = this.registry.list();
    const active = identities.filter((item) => item.status === "active").length;
    const verified = identities.filter((item) => item.verificationStatus === "verified").length;
    const duplicates = this.intelligence.duplicateCandidates().length;
    const findings: string[] = [];
    if (duplicates > 0) findings.push(`${duplicates} duplicate candidate(s) require review.`);
    if (identities.length === 0) findings.push("Identity registry is empty.");
    const score = Math.max(0, Math.min(100, 70 + Math.min(identities.length, 10) * 2 + (duplicates === 0 ? 10 : 0)));
    return {
      status: score >= 85 ? "healthy" : score >= 60 ? "degraded" : "critical",
      score,
      identities: identities.length,
      activeIdentities: active,
      verifiedIdentities: verified,
      relationships: this.graph.count(),
      duplicateCandidates: duplicates,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
