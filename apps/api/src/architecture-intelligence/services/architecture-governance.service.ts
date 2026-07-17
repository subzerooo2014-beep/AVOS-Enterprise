import { Injectable } from "@nestjs/common";
import { ArchitectureAnalysisReport } from "../contracts/architecture-intelligence.contracts";

@Injectable()
export class ArchitectureGovernanceService {
  validate(report: ArchitectureAnalysisReport): {
    readonly approved: boolean;
    readonly humanAuthorityPreserved: boolean;
    readonly auditByDesign: boolean;
    readonly decisionTraceability: boolean;
    readonly blockingFindings: readonly string[];
  } {
    const blockingFindings = report.findings
      .filter((finding) => finding.severity === "critical")
      .map((finding) => finding.description);

    return {
      approved: blockingFindings.length === 0,
      humanAuthorityPreserved: true,
      auditByDesign: true,
      decisionTraceability: true,
      blockingFindings,
    };
  }
}