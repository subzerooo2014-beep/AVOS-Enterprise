import { Injectable } from "@nestjs/common";
import { OmegaFinding, OmegaScore } from "../omega.types";

@Injectable()
export class OmegaScoreEngineService {
  calculate(findings: readonly OmegaFinding[]): OmegaScore {
    const penalties = findings.reduce(
      (sum, finding) =>
        sum +
        ({
          info: 0,
          low: 2,
          medium: 6,
          high: 14,
          critical: 25,
        }[finding.severity] ?? 0),
      0,
    );

    const critical = findings.filter(
      (finding) => finding.severity === "critical",
    ).length;
    const high = findings.filter(
      (finding) => finding.severity === "high",
    ).length;

    const risk = Math.min(100, critical * 25 + high * 12 + penalties / 4);
    const quality = Math.max(0, 100 - penalties);
    const trust = Math.max(0, 100 - critical * 20 - high * 8);
    const readiness = Math.max(
      0,
      Math.round(quality * 0.45 + trust * 0.35 + (100 - risk) * 0.2),
    );
    const technicalDebt = Math.min(100, penalties);

    return {
      quality: Number(quality.toFixed(2)),
      trust: Number(trust.toFixed(2)),
      risk: Number(risk.toFixed(2)),
      readiness,
      technicalDebt: Number(technicalDebt.toFixed(2)),
    };
  }
}
