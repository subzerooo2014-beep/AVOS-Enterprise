import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  ApprovalRequest,
  ComplianceCheck,
  GovernanceAuditRecord,
  PartnerAgreement,
  PartnerProfile,
  PartnerSettlement,
  PermissionPolicy,
  RiskAssessment,
  SlaRecord,
} from "./industry-governance-partners.types";
import {
  INDUSTRY_GOVERNANCE_PARTNER_COMPONENTS,
  SUPPORTED_GOVERNANCE_INDUSTRIES,
} from "./industry-governance-partners.registry";

@Injectable()
export class IndustryGovernancePartnersService {
  private readonly partners = new Map<string, PartnerProfile>();
  private readonly permissions = new Map<string, PermissionPolicy>();
  private readonly approvals = new Map<string, ApprovalRequest>();
  private readonly complianceChecks = new Map<string, ComplianceCheck>();
  private readonly risks = new Map<string, RiskAssessment>();
  private readonly agreements = new Map<string, PartnerAgreement>();
  private readonly slas = new Map<string, SlaRecord>();
  private readonly settlements = new Map<string, PartnerSettlement>();
  private readonly audits = new Map<string, GovernanceAuditRecord>();

  components() {
    return {
      system: "AVOS Industry Governance, Compliance & Partner Ecosystem",
      architecture: "INDUSTRY_BASED",
      components: [...INDUSTRY_GOVERNANCE_PARTNER_COMPONENTS],
      industries: [...SUPPORTED_GOVERNANCE_INDUSTRIES],
      status: "READY",
    };
  }

  createPartner(
    input: Omit<PartnerProfile, "id" | "status" | "createdAt" | "updatedAt">,
  ): PartnerProfile {
    this.requireIndustry(input.industryKey);

    if (
      !input.tenantId?.trim() ||
      !input.organizationId?.trim()
    ) {
      throw new Error("tenantId and organizationId are required");
    }

    const now = new Date().toISOString();
    const partner: PartnerProfile = {
      ...input,
      id: randomUUID(),
      status: "APPLIED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.partners.set(partner.id, partner);
    return this.clonePartner(partner);
  }

  verifyPartner(id: string, verificationScore: number): PartnerProfile {
    const partner = this.requirePartner(id);

    if (verificationScore < 0 || verificationScore > 100) {
      throw new Error("verificationScore must be between 0 and 100");
    }

    partner.verificationScore = verificationScore;
    partner.status = verificationScore >= 70 ? "VERIFIED" : "SUSPENDED";
    partner.updatedAt = new Date().toISOString();
    this.partners.set(id, partner);

    return this.clonePartner(partner);
  }

  activatePartner(id: string): PartnerProfile {
    const partner = this.requirePartner(id);

    if (partner.status !== "VERIFIED") {
      throw new Error("Only verified partners can be activated");
    }

    partner.status = "ACTIVE";
    partner.updatedAt = new Date().toISOString();
    this.partners.set(id, partner);

    return this.clonePartner(partner);
  }

  createPermissionPolicy(
    input: Omit<PermissionPolicy, "id" | "createdAt" | "updatedAt">,
  ): PermissionPolicy {
    const now = new Date().toISOString();
    const policy: PermissionPolicy = {
      ...input,
      id: randomUUID(),
      actions: [...input.actions],
      roles: [...input.roles],
      createdAt: now,
      updatedAt: now,
    };

    this.permissions.set(policy.id, policy);
    return this.clonePermission(policy);
  }

  evaluatePermission(
    tenantId: string,
    role: string,
    resource: string,
    action: string,
  ) {
    const policies = Array.from(this.permissions.values()).filter(
      (policy) =>
        policy.tenantId === tenantId &&
        policy.active &&
        policy.resource === resource &&
        policy.roles.includes(role) &&
        policy.actions.includes(action),
    );

    const denied = policies.some((policy) => policy.effect === "DENY");
    const allowed = !denied && policies.some((policy) => policy.effect === "ALLOW");

    return {
      tenantId,
      role,
      resource,
      action,
      allowed,
      matchedPolicies: policies.map((policy) => policy.id),
      evaluatedAt: new Date().toISOString(),
    };
  }

  createApproval(
    input: Omit<ApprovalRequest, "id" | "status" | "createdAt" | "updatedAt">,
  ): ApprovalRequest {
    const now = new Date().toISOString();
    const approval: ApprovalRequest = {
      ...input,
      id: randomUUID(),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  decideApproval(
    id: string,
    decision: "APPROVED" | "REJECTED",
    reason?: string,
  ): ApprovalRequest {
    const approval = this.requireApproval(id);
    approval.status = decision;
    approval.reason = reason;
    approval.updatedAt = new Date().toISOString();
    this.approvals.set(id, approval);
    return { ...approval };
  }

  runComplianceCheck(
    input: Omit<ComplianceCheck, "id" | "status" | "createdAt"> & {
      passed: boolean;
      reviewRequired?: boolean;
    },
  ): ComplianceCheck {
    this.requireIndustry(input.industryKey);

    const status: ComplianceCheck["status"] = input.reviewRequired
      ? "REVIEW"
      : input.passed
        ? "PASS"
        : "FAIL";

    const check: ComplianceCheck = {
      id: randomUUID(),
      tenantId: input.tenantId,
      industryKey: input.industryKey,
      entityType: input.entityType,
      entityId: input.entityId,
      policyKey: input.policyKey,
      status,
      findings: [...input.findings],
      createdAt: new Date().toISOString(),
    };

    this.complianceChecks.set(check.id, check);
    return { ...check, findings: [...check.findings] };
  }

  assessRisk(
    tenantId: string,
    industryKey: string,
    subjectType: string,
    subjectId: string,
    signals: Record<string, number>,
  ): RiskAssessment {
    this.requireIndustry(industryKey);

    const riskScore = Math.min(
      100,
      Object.values(signals).reduce((sum, value) => sum + value, 0),
    );

    const level: RiskAssessment["level"] =
      riskScore >= 85
        ? "CRITICAL"
        : riskScore >= 65
          ? "HIGH"
          : riskScore >= 35
            ? "MEDIUM"
            : "LOW";

    const assessment: RiskAssessment = {
      id: randomUUID(),
      tenantId,
      industryKey,
      subjectType,
      subjectId,
      riskScore,
      level,
      controls: [
        "approval-control",
        "audit-control",
        "revenue-protection-control",
      ],
      blocked: level === "CRITICAL",
      createdAt: new Date().toISOString(),
    };

    this.risks.set(assessment.id, assessment);
    return { ...assessment, controls: [...assessment.controls] };
  }

  createAgreement(
    input: Omit<PartnerAgreement, "id" | "status" | "createdAt" | "updatedAt">,
  ): PartnerAgreement {
    this.requirePartner(input.partnerId);

    const now = new Date().toISOString();
    const agreement: PartnerAgreement = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      terms: { ...input.terms },
      createdAt: now,
      updatedAt: now,
    };

    this.agreements.set(agreement.id, agreement);
    return this.cloneAgreement(agreement);
  }

  activateAgreement(id: string): PartnerAgreement {
    const agreement = this.requireAgreement(id);
    agreement.status = "ACTIVE";
    agreement.updatedAt = new Date().toISOString();
    this.agreements.set(id, agreement);
    return this.cloneAgreement(agreement);
  }

  createSla(
    input: Omit<SlaRecord, "id" | "breachCount" | "createdAt" | "updatedAt">,
  ): SlaRecord {
    this.requirePartner(input.partnerId);

    const now = new Date().toISOString();
    const sla: SlaRecord = {
      ...input,
      id: randomUUID(),
      breachCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.slas.set(sla.id, sla);
    return { ...sla };
  }

  recordSlaBreach(id: string): SlaRecord {
    const sla = this.requireSla(id);
    sla.breachCount += 1;
    sla.updatedAt = new Date().toISOString();
    this.slas.set(id, sla);
    return { ...sla };
  }

  createSettlement(
    input: Omit<
      PartnerSettlement,
      "id" | "netAmount" | "status" | "createdAt" | "updatedAt"
    >,
  ): PartnerSettlement {
    this.requirePartner(input.partnerId);

    if (input.grossAmount < 0 || input.deductions < 0) {
      throw new Error("Settlement values cannot be negative");
    }

    const now = new Date().toISOString();
    const settlement: PartnerSettlement = {
      ...input,
      id: randomUUID(),
      netAmount: Number((input.grossAmount - input.deductions).toFixed(2)),
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    this.settlements.set(settlement.id, settlement);
    return { ...settlement };
  }

  approveSettlement(id: string): PartnerSettlement {
    const settlement = this.requireSettlement(id);
    settlement.status = "APPROVED";
    settlement.updatedAt = new Date().toISOString();
    this.settlements.set(id, settlement);
    return { ...settlement };
  }

  trackAudit(
    input: Omit<GovernanceAuditRecord, "id" | "createdAt">,
  ): GovernanceAuditRecord {
    const record: GovernanceAuditRecord = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.audits.set(record.id, record);
    return { ...record, payload: { ...record.payload } };
  }

  dashboard() {
    const partners = Array.from(this.partners.values());
    const approvals = Array.from(this.approvals.values());
    const checks = Array.from(this.complianceChecks.values());
    const risks = Array.from(this.risks.values());

    return {
      system: "AVOS Industry Governance, Compliance & Partner Ecosystem",
      architecture: "INDUSTRY_BASED",
      partners: partners.length,
      activePartners: partners.filter((partner) => partner.status === "ACTIVE").length,
      permissionPolicies: this.permissions.size,
      approvals: approvals.length,
      pendingApprovals: approvals.filter((approval) => approval.status === "PENDING").length,
      complianceChecks: checks.length,
      failedComplianceChecks: checks.filter((check) => check.status === "FAIL").length,
      riskAssessments: risks.length,
      criticalRisks: risks.filter((risk) => risk.level === "CRITICAL").length,
      agreements: this.agreements.size,
      slas: this.slas.size,
      settlements: this.settlements.size,
      audits: this.audits.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireIndustry(key: string) {
    if (
      !SUPPORTED_GOVERNANCE_INDUSTRIES.includes(
        key as (typeof SUPPORTED_GOVERNANCE_INDUSTRIES)[number],
      )
    ) {
      throw new Error(`Unsupported industry: ${key}`);
    }
  }

  private requirePartner(id: string) {
    const value = this.partners.get(id);
    if (!value) throw new Error(`Partner not found: ${id}`);
    return value;
  }

  private requireApproval(id: string) {
    const value = this.approvals.get(id);
    if (!value) throw new Error(`Approval not found: ${id}`);
    return value;
  }

  private requireAgreement(id: string) {
    const value = this.agreements.get(id);
    if (!value) throw new Error(`Agreement not found: ${id}`);
    return value;
  }

  private requireSla(id: string) {
    const value = this.slas.get(id);
    if (!value) throw new Error(`SLA not found: ${id}`);
    return value;
  }

  private requireSettlement(id: string) {
    const value = this.settlements.get(id);
    if (!value) throw new Error(`Settlement not found: ${id}`);
    return value;
  }

  private clonePartner(value: PartnerProfile): PartnerProfile {
    return { ...value, metadata: { ...value.metadata } };
  }

  private clonePermission(value: PermissionPolicy): PermissionPolicy {
    return {
      ...value,
      actions: [...value.actions],
      roles: [...value.roles],
    };
  }

  private cloneAgreement(value: PartnerAgreement): PartnerAgreement {
    return { ...value, terms: { ...value.terms } };
  }
}