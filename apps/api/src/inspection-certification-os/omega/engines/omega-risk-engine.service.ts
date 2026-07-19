import { Injectable } from "@nestjs/common";
import { OmegaFinding } from "../omega.types";

@Injectable()
export class OmegaRiskEngineService {
  rank(findings: readonly OmegaFinding[]): readonly OmegaFinding[] {
    const order = {
      critical: 5,
      high: 4,
      medium: 3,
      low: 2,
      info: 1,
    } as const;

    return [...findings].sort(
      (left, right) => order[right.severity] - order[left.severity],
    );
  }

  critical(findings: readonly OmegaFinding[]): readonly OmegaFinding[] {
    return findings.filter((finding) => finding.severity === "critical");
  }
}
