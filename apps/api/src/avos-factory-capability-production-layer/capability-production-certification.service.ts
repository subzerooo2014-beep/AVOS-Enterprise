import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapabilityGovernanceReport,
  CapabilityProductionCertificate
} from "./capability-production.contracts";

@Injectable()
export class CapabilityProductionCertificationService {
  private readonly items = new Map<string, CapabilityProductionCertificate>();

  certify(
    report: CapabilityGovernanceReport,
    approvedBy: string
  ): CapabilityProductionCertificate {
    const humanApproved =
      report.humanApprovalRequired &&
      approvedBy.startsWith("human:");

    const status =
      report.passed && humanApproved
        ? "certified"
        : "rejected";

    const item: CapabilityProductionCertificate = {
      id: randomUUID(),
      blueprintId: report.blueprintId,
      status,
      score: report.score,
      approvedBy: humanApproved ? approvedBy : null,
      humanFinalAuthority: humanApproved,
      reportId: report.id,
      certifiedAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilityProductionCertificate[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
