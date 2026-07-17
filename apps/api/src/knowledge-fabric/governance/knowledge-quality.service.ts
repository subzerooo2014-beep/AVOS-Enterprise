
import { Injectable } from "@nestjs/common";
import { KnowledgeGovernanceSubject, KnowledgeQualityAssessment } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeQualityService {
  assess(subject: KnowledgeGovernanceSubject): KnowledgeQualityAssessment {
    const metadata = subject.metadata ?? {};
    const completeness = this.clamp(Object.keys(metadata).length >= 4 ? 100 : 55 + Object.keys(metadata).length * 10);
    const ageMs = Date.now() - new Date(subject.updatedAt ?? subject.createdAt ?? Date.now()).getTime();
    const freshness = this.clamp(100 - Math.floor(ageMs / 86_400_000));
    const consistency = this.clamp(subject.version && subject.version > 0 ? 100 : 70);
    const provenance = this.clamp(metadata.source || metadata.provenance ? 100 : 60);
    const trust = this.clamp(subject.trustScore ?? 50);
    const overallScore = Math.round((completeness + freshness + consistency + provenance + trust) / 5);
    const findings: string[] = [];
    if (completeness < 80) findings.push("Metadata completeness is below target.");
    if (freshness < 70) findings.push("Knowledge may require refresh.");
    if (provenance < 80) findings.push("Provenance evidence is incomplete.");
    if (trust < 70) findings.push("Trust score is below activation threshold.");
    return { knowledgeId: subject.knowledgeId, completeness, freshness, consistency, provenance, trust, overallScore, findings, assessedAt: new Date().toISOString() };
  }

  private clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}