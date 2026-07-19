import { Injectable } from "@nestjs/common";
import { GovernanceEvidence } from "./omega-governance.types";

@Injectable()
export class DataProvenanceEngineService {
  evaluate(evidence: readonly GovernanceEvidence[]) {
    const valid = evidence.filter(
      (item) =>
        item.source.length > 0 &&
        item.category.length > 0 &&
        item.checksum.length === 64,
    ).length;

    const score =
      evidence.length === 0
        ? 0
        : Number(((valid / evidence.length) * 100).toFixed(2));

    return {
      score,
      valid,
      total: evidence.length,
      complete: valid === evidence.length && evidence.length > 0,
      sources: [...new Set(evidence.map((item) => item.source))],
    };
  }
}
