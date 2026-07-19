import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { GovernanceEvidence } from "./omega-governance.types";

@Injectable()
export class EvidenceRegistryService {
  private readonly entries: GovernanceEvidence[] = [];

  capture(input: {
    readonly source: string;
    readonly category: string;
    readonly payload: Readonly<Record<string, unknown>>;
  }): GovernanceEvidence {
    const checksum = createHash("sha256")
      .update(JSON.stringify(input.payload))
      .digest("hex");

    const evidence: GovernanceEvidence = {
      evidenceId: `OMEGA-EVIDENCE-${randomUUID()}`,
      source: input.source,
      category: input.category,
      capturedAt: new Date().toISOString(),
      checksum,
      payload: input.payload,
    };

    this.entries.push(evidence);
    return evidence;
  }

  all(): readonly GovernanceEvidence[] {
    return [...this.entries];
  }
}
