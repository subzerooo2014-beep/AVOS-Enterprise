import {
  BadRequestException,
  Injectable
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryReleaseGovernanceDecision
} from "./avos-factory-certification-integration.contracts";
import {
  AvosFactoryCertificateRegistryService
} from "./avos-factory-certificate-registry.service";
import {
  AvosFactoryReleaseReadinessService
} from "./avos-factory-release-readiness.service";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";

@Injectable()
export class AvosFactoryReleaseGovernanceService {
  private readonly decisions: AvosFactoryReleaseGovernanceDecision[] = [];

  constructor(
    private readonly certificates: AvosFactoryCertificateRegistryService,
    private readonly readiness: AvosFactoryReleaseReadinessService,
    private readonly audit: AvosFactoryAuditService
  ) {}

  async decide(input: {
    certificateId: string;
    actor: string;
    approvedBy: string;
    humanApproved: boolean;
    decision: "approved" | "rejected";
    reason: string;
  }): Promise<AvosFactoryReleaseGovernanceDecision> {
    if (!input.humanApproved || !input.approvedBy?.trim()) {
      throw new BadRequestException(
        "Release decision requires Human Final Authority approval."
      );
    }

    const certificate = this.certificates.get(input.certificateId);

    if (!certificate || certificate.status !== "certified") {
      throw new BadRequestException(
        "An active certified certificate is required."
      );
    }

    const readiness =
      this.readiness.latest() ??
      await this.readiness.evaluate();

    const readinessStatus =
      typeof readiness === "object" &&
      readiness !== null &&
      "status" in readiness
        ? String(readiness.status)
        : "unknown";

    if (
      input.decision === "approved" &&
      readinessStatus !== "ready" &&
      readinessStatus !== "certified" &&
      readinessStatus !== "approved"
    ) {
      throw new BadRequestException(
        `Release readiness status does not permit approval: ${readinessStatus}`
      );
    }

    const readinessId =
      typeof readiness === "object" &&
      readiness !== null &&
      "id" in readiness &&
      typeof readiness.id === "string"
        ? readiness.id
        : undefined;

    const decision: AvosFactoryReleaseGovernanceDecision = {
      id: randomUUID(),
      subjectId: certificate.subjectId,
      certificateId: certificate.id,
      releaseReadinessId: readinessId,
      version: certificate.version,
      decision: input.decision,
      actor: input.actor,
      approvedBy: input.approvedBy,
      humanApproved: true,
      reason: input.reason,
      decidedAt: new Date().toISOString()
    };

    this.decisions.unshift(decision);

    this.audit.append({
      category: "certification",
      action: "factory-release-governance-decided",
      actor: input.actor,
      approvedBy: input.approvedBy,
      success: input.decision === "approved",
      resourceId: decision.id,
      details: {
        certificateId: certificate.id,
        readinessId,
        readinessStatus,
        decision: input.decision,
        reason: input.reason
      }
    });

    return structuredClone(decision);
  }

  list(limit = 100): AvosFactoryReleaseGovernanceDecision[] {
    return this.decisions
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((decision) => structuredClone(decision));
  }
}
