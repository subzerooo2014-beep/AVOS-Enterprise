import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceReadinessService } from "./adaptive-growth-approval-governance-readiness.service";

@Injectable()
export class AdaptiveGrowthApprovalGovernanceCertificationService {
  private latest:
    | Record<string, unknown>
    | undefined;

  constructor(
    private readonly readiness:
      AdaptiveGrowthApprovalGovernanceReadinessService,
  ) {}

  certify(
    approvedBy = "human:khalifa",
  ) {
    const readiness =
      this.readiness.run();

    if (readiness.status !== "ready") {
      throw new BadRequestException(
        "Mega Pack 2B is not ready for certification.",
      );
    }

    if (!approvedBy.startsWith("human:")) {
      throw new BadRequestException(
        "Certification requires Human Final Authority.",
      );
    }

    this.latest = {
      id: `ags-mp2b-certification:${Date.now()}`,
      name:
        "AVOS Adaptive Growth Studio — Mega Pack 2B",
      version: "AGS-MP2B-1.0.0",
      status: "certified",
      score: readiness.score,
      approvedBy,
      humanFinalAuthority: true,
      scope: [
        "Approval Governance",
        "Human Final Authority",
        "Decision Audit",
        "Approval Queue",
        "Policy Engine",
        "Decision Signature",
        "Evidence",
        "Explainability",
        "Execution Core Integration",
      ],
      certifiedAt:
        new Date().toISOString(),
    };

    return this.latest;
  }

  status() {
    return (
      this.latest ?? {
        status: "not-certified",
      }
    );
  }
}