import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AgsApprovalPolicy,
} from "./adaptive-growth-approval.contracts";
import { AgsActionRiskLevel } from "../execution-core/adaptive-growth-execution.contracts";

@Injectable()
export class AdaptiveGrowthApprovalPolicyService {
  private readonly policies =
    new Map<AgsActionRiskLevel, AgsApprovalPolicy>();

  constructor() {
    this.registerDefaults();
  }

  resolve(
    riskLevel: AgsActionRiskLevel,
  ): AgsApprovalPolicy {
    const policy = this.policies.get(riskLevel);

    if (!policy) {
      throw new NotFoundException(
        `Approval policy not found for risk level: ${riskLevel}`,
      );
    }

    return policy;
  }

  list(): AgsApprovalPolicy[] {
    return [...this.policies.values()];
  }

  status() {
    return {
      name: "AGS Approval Policy Engine",
      status: "operational",
      policies: this.policies.size,
      riskAware: true,
      authorityAware: true,
      humanFinalAuthority: true,
    };
  }

  private registerDefaults(): void {
    const policies: AgsApprovalPolicy[] = [
      {
        key: "ags-approval-low",
        riskLevel: "low",
        requiredAuthority: "growth-operator",
        minimumEvidenceItems: 1,
        requiresReason: true,
        requiresSignature: true,
        expiresAfterHours: 72,
        enabled: true,
      },
      {
        key: "ags-approval-medium",
        riskLevel: "medium",
        requiredAuthority: "growth-manager",
        minimumEvidenceItems: 2,
        requiresReason: true,
        requiresSignature: true,
        expiresAfterHours: 48,
        enabled: true,
      },
      {
        key: "ags-approval-high",
        riskLevel: "high",
        requiredAuthority: "executive-approver",
        minimumEvidenceItems: 3,
        requiresReason: true,
        requiresSignature: true,
        expiresAfterHours: 24,
        enabled: true,
      },
      {
        key: "ags-approval-critical",
        riskLevel: "critical",
        requiredAuthority: "human-final-authority",
        minimumEvidenceItems: 4,
        requiresReason: true,
        requiresSignature: true,
        expiresAfterHours: 12,
        enabled: true,
      },
    ];

    for (const policy of policies) {
      this.policies.set(policy.riskLevel, policy);
    }
  }
}