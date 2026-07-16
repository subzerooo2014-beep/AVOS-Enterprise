import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { CapabilityIntelligenceService } from "../capability-intelligence/capability-intelligence.service";
import {
  CAPABILITY_CERTIFICATION_REQUIREMENTS,
} from "./capability-enterprise.registry";
import {
  CapabilityCertification,
  CapabilityCertificationLevel,
} from "./capability-enterprise.types";
import { CapabilityApprovalService } from "./capability-approval.service";

@Injectable()
export class CapabilityCertificationService {
  private readonly certifications = new Map<string, CapabilityCertification>();

  constructor(
    private readonly intelligence: CapabilityIntelligenceService,
    private readonly approvals: CapabilityApprovalService,
  ) {}

  certify(input: {
    capabilityKey: string;
    level: CapabilityCertificationLevel;
    certifiedBy: string;
    evidence?: string[];
    expiresAt?: string;
  }) {
    if (!this.approvals.isApproved(input.capabilityKey, "CERTIFY")) {
      return { success: false, reason: "CERTIFICATION_APPROVAL_REQUIRED" };
    }

    const insight =
      this.intelligence.getLatest(input.capabilityKey) ??
      this.intelligence.analyze(input.capabilityKey);
    const requirements = CAPABILITY_CERTIFICATION_REQUIREMENTS[input.level];

    if (
      insight.score.qualityIndex < requirements.quality ||
      insight.score.trustScore < requirements.trust ||
      insight.score.riskScore > requirements.risk
    ) {
      return {
        success: false,
        reason: "CERTIFICATION_REQUIREMENTS_NOT_MET",
        requirements,
        actual: {
          quality: insight.score.qualityIndex,
          trust: insight.score.trustScore,
          risk: insight.score.riskScore,
        },
      };
    }

    const certification: CapabilityCertification = {
      id: randomUUID(),
      capabilityKey: input.capabilityKey.toLowerCase(),
      level: input.level,
      status: "ACTIVE",
      qualityThreshold: requirements.quality,
      trustThreshold: requirements.trust,
      riskCeiling: requirements.risk,
      evidence: [...(input.evidence ?? [])],
      certifiedBy: input.certifiedBy,
      certifiedAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
    };

    this.certifications.set(certification.capabilityKey, certification);
    return { success: true, certification: structuredClone(certification) };
  }

  get(capabilityKey: string) {
    const certification = this.certifications.get(capabilityKey.toLowerCase());
    return certification ? structuredClone(certification) : null;
  }

  list() {
    return [...this.certifications.values()].map((certification) =>
      structuredClone(certification),
    );
  }
}