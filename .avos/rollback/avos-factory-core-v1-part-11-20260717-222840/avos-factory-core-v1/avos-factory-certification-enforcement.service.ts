import { Injectable } from "@nestjs/common";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryCertificationService
} from "./avos-factory-certification.service";
import {
  AvosFactoryEnforcementMetricsService
} from "./avos-factory-enforcement-metrics.service";
import {
  AvosFactoryGovernanceService
} from "./avos-factory-governance.service";

@Injectable()
export class AvosFactoryCertificationEnforcementService {
  constructor(
    private readonly certification:
      AvosFactoryCertificationService,
    private readonly governance:
      AvosFactoryGovernanceService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly metrics:
      AvosFactoryEnforcementMetricsService
  ) {}

  async certify(input: {
    approvedBy: string;
    humanApproved: boolean;
    requestedBy?: string;
  }) {
    this.metrics.increment("certificationsAttempted");

    const actor =
      input.requestedBy ??
      input.approvedBy;

    this.governance.assertHumanApproval({
      operation: "Factory certification",
      humanApproved:
        input.humanApproved,
      approvedBy:
        input.approvedBy
    });

    this.writeAudit({
      category: "certification",
      action: "factory-certification-started",
      actor,
      approvedBy:
        input.approvedBy,
      success: true
    });

    try {
      const result =
        await this.certification.certify({
          approvedBy:
            input.approvedBy,
          humanApproved:
            input.humanApproved
        });

      if (result.status === "certified") {
        this.metrics.increment(
          "certificationsCompleted"
        );
      } else {
        this.metrics.increment(
          "certificationsRejected"
        );
      }

      this.writeAudit({
        category: "certification",
        action:
          result.status === "certified"
            ? "factory-certification-completed"
            : "factory-certification-rejected",
        actor,
        approvedBy:
          input.approvedBy,
        success:
          result.status === "certified",
        resourceId:
          result.id,
        details: {
          score:
            result.score,
          verificationReportId:
            result.verificationReportId
        }
      });

      return result;
    } catch (error) {
      this.metrics.increment(
        "certificationsRejected"
      );

      this.writeAudit({
        category: "certification",
        action: "factory-certification-failed",
        actor,
        approvedBy:
          input.approvedBy,
        success: false,
        details: {
          error:
            error instanceof Error
              ? error.message
              : String(error)
        }
      });

      throw error;
    }
  }

  private writeAudit(
    event: Parameters<
      AvosFactoryAuditService["append"]
    >[0]
  ): void {
    this.audit.append(event);
    this.metrics.increment("auditEventsWritten");
  }
}
