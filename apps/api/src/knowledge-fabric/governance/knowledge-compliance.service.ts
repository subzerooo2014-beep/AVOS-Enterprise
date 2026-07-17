
import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeComplianceFinding, KnowledgeGovernanceSubject } from "./knowledge-governance.types";

@Injectable()
export class KnowledgeComplianceService {
  check(subject: KnowledgeGovernanceSubject): KnowledgeComplianceFinding[] {
    const now = new Date().toISOString();
    const metadata = subject.metadata ?? {};
    return [
      this.finding(subject.knowledgeId, "OWNER_ASSIGNED", Boolean(subject.ownerId), "MEDIUM", subject.ownerId ? "Owner assigned." : "Knowledge owner is missing.", now),
      this.finding(subject.knowledgeId, "PROVENANCE_PRESENT", Boolean(metadata.source || metadata.provenance), "HIGH", metadata.source || metadata.provenance ? "Provenance present." : "Provenance is missing.", now),
      this.finding(subject.knowledgeId, "CLASSIFICATION_ASSIGNED", Boolean(subject.classification), "MEDIUM", subject.classification ? "Classification assigned." : "Classification is missing.", now),
      this.finding(subject.knowledgeId, "TRUST_THRESHOLD", (subject.trustScore ?? 0) >= 70, "HIGH", (subject.trustScore ?? 0) >= 70 ? "Trust threshold satisfied." : "Trust threshold not satisfied.", now),
    ];
  }

  private finding(knowledgeId: string, control: string, compliant: boolean, riskLevel: KnowledgeComplianceFinding["riskLevel"], message: string, checkedAt: string): KnowledgeComplianceFinding {
    return { id: randomUUID(), knowledgeId, control, compliant, riskLevel, message, checkedAt };
  }
}