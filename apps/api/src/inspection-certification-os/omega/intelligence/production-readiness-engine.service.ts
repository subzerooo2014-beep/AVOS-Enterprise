import { Injectable } from "@nestjs/common";
import { OmegaIntelligenceReport } from "./omega-intelligence.types";

@Injectable()
export class ProductionReadinessEngineService {
  classify(report: OmegaIntelligenceReport) {
    const approved =
      report.overallScore >= 85 &&
      report.readiness.blockers.length === 0;

    return {
      approved,
      level: approved
        ? report.readiness.level
        : "remediation-required",
      overallScore: report.overallScore,
      blockers: report.readiness.blockers,
      warnings: report.readiness.warnings,
      humanFinalAuthority: true,
      autonomousFinalApproval: false,
    };
  }
}
