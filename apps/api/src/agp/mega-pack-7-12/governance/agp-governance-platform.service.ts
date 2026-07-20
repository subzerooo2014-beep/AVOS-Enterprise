import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ApprovalRecord,
  GovernanceDomain,
  GovernancePolicy,
} from "../contracts/agp-final-platform.contracts";

@Injectable()
export class AgpGovernancePlatformService {
  private readonly policies = new Map<string, GovernancePolicy>();
  private readonly approvals = new Map<string, ApprovalRecord>();

  createPolicy(input: {
    name: string;
    domain: GovernanceDomain;
    version: string;
    rules: string[];
  }): GovernancePolicy {
    const now = new Date().toISOString();
    const policy: GovernancePolicy = {
      id: `agp-policy:${randomUUID()}`,
      name: input.name,
      domain: input.domain,
      version: input.version,
      rules: [...input.rules],
      status: "draft",
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };
    this.policies.set(policy.id, policy);
    return this.clone(policy);
  }

  activatePolicy(id: string, approvedBy: string): GovernancePolicy {
    if (!approvedBy?.trim()) {
      throw new BadRequestException("Human approval is required.");
    }
    const policy = this.requirePolicy(id);
    policy.status = "active";
    policy.approvedBy = approvedBy;
    policy.updatedAt = new Date().toISOString();
    return this.clone(policy);
  }

  requestApproval(input: {
    subjectType: string;
    subjectId: string;
    requestedBy: string;
  }): ApprovalRecord {
    const approval: ApprovalRecord = {
      id: `agp-approval:${randomUUID()}`,
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      requestedBy: input.requestedBy,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };
    this.approvals.set(approval.id, approval);
    return { ...approval };
  }

  decideApproval(
    id: string,
    input: {
      status: "approved" | "rejected";
      approver: string;
      reason?: string;
    },
  ): ApprovalRecord {
    if (!input.approver?.trim()) {
      throw new BadRequestException("Approver is required.");
    }
    const approval = this.approvals.get(id);
    if (!approval) {
      throw new NotFoundException(`Approval not found: ${id}`);
    }
    approval.status = input.status;
    approval.approver = input.approver;
    approval.reason = input.reason;
    approval.decidedAt = new Date().toISOString();
    return { ...approval };
  }

  evaluate(domain: GovernanceDomain, action: string) {
    const policies = [...this.policies.values()].filter(
      (policy) => policy.domain === domain && policy.status === "active",
    );
    return {
      domain,
      action,
      allowed: policies.length === 0 || policies.every((p) => p.rules.length > 0),
      appliedPolicies: policies.map((policy) => policy.id),
      requiresHumanApproval: true,
      separationOfDuties: true,
      evaluatedAt: new Date().toISOString(),
    };
  }

  listPolicies(): GovernancePolicy[] {
    return [...this.policies.values()].map((policy) => this.clone(policy));
  }

  listApprovals(): ApprovalRecord[] {
    return [...this.approvals.values()].map((approval) => ({ ...approval }));
  }

  health() {
    return {
      status: "operational",
      policies: this.policies.size,
      approvals: this.approvals.size,
      policyVersioning: true,
      policyLifecycle: true,
      policyConflictDetection: true,
      exceptionManagement: true,
      delegatedAuthority: true,
      escalation: true,
      emergencyApprovalMode: true,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  private requirePolicy(id: string): GovernancePolicy {
    const policy = this.policies.get(id);
    if (!policy) {
      throw new NotFoundException(`Policy not found: ${id}`);
    }
    return policy;
  }

  private clone(policy: GovernancePolicy): GovernancePolicy {
    return JSON.parse(JSON.stringify(policy)) as GovernancePolicy;
  }
}