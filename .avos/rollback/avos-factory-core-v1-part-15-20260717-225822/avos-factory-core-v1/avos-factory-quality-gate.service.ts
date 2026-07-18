import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryQualityGate
} from "./avos-factory-validation.contracts";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryQualityGateService {
  private readonly gates: AvosFactoryQualityGate[] = [];

  constructor(
    private readonly validation: AvosFactoryValidationEngineService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  create(input: {
    subjectId: string;
    reportId: string;
    minimumScore?: number;
  }): AvosFactoryQualityGate {
    const report = this.validation.get(input.reportId);

    if (!report) {
      throw new BadRequestException(`Validation report not found: ${input.reportId}`);
    }

    const minimumScore = Math.max(
      0,
      Math.min(100, Math.round(input.minimumScore ?? 80))
    );

    const automaticPass =
      report.score >= minimumScore &&
      report.blockingFindings === 0;

    const gate: AvosFactoryQualityGate = {
      id: randomUUID(),
      subjectId: input.subjectId,
      reportId: input.reportId,
      minimumScore,
      actualScore: report.score,
      blockingFindings: report.blockingFindings,
      status: automaticPass ? "passed" : "blocked",
      humanApproved: false,
      createdAt: new Date().toISOString()
    };

    this.gates.unshift(gate);
    return structuredClone(gate);
  }

  decide(input: {
    gateId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    decision: "approved" | "rejected";
    reason: string;
  }): AvosFactoryQualityGate {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Quality gate decision requires Human Final Authority approval."
      );
    }

    const gate = this.gates.find((candidate) => candidate.id === input.gateId);

    if (!gate) {
      throw new BadRequestException(`Quality gate not found: ${input.gateId}`);
    }

    gate.status = input.decision;
    gate.humanApproved = true;
    gate.approvedBy = input.approvedBy;
    gate.decisionReason = input.reason;
    gate.decidedAt = new Date().toISOString();

    this.audit.append({
      category: "governance",
      action: "factory-quality-gate-decided",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: input.decision === "approved",
      resourceId: gate.id,
      details: {
        decision: input.decision,
        reason: input.reason
      }
    });

    return structuredClone(gate);
  }

  list(limit = 100): AvosFactoryQualityGate[] {
    return this.gates
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((gate) => structuredClone(gate));
  }
}
