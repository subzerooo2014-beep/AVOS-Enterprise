import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GovernanceApprovalMatrixDecision,
  GovernanceApprovalMatrixRule,
  GovernanceApprovalTier,
  GovernanceJsonValue,
  GovernanceRequest,
  GovernanceRiskLevel,
} from "../contracts";
import {
  CreateApprovalMatrixRuleDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";

@Injectable()
export class RuntimeGovernanceApprovalMatrixService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
  ) {}

  createRule(
    dto: CreateApprovalMatrixRuleDto,
  ): GovernanceApprovalMatrixRule {
    const rule:
      GovernanceApprovalMatrixRule = {
      id:
        randomUUID(),
      name:
        dto.name,
      environment:
        dto.environment,
      requestTypes:
        dto.requestTypes,
      minimumRiskLevel:
        dto.minimumRiskLevel,
      maximumRiskLevel:
        dto.maximumRiskLevel,
      minimumBlastRadius:
        dto.minimumBlastRadius,
      minimumBusinessCriticality:
        dto.minimumBusinessCriticality,
      rollbackPlanRequired:
        dto.rollbackPlanRequired,
      minimumTestCoverage:
        dto.minimumTestCoverage,
      tier:
        dto.tier,
      requiredApprovals:
        dto.requiredApprovals,
      requiredRoles:
        dto.requiredRoles,
      enabled:
        dto.enabled,
      priority:
        dto.priority,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
    };

    return this.store
      .saveApprovalMatrixRule(
        rule,
      );
  }

  listRules():
    GovernanceApprovalMatrixRule[] {
    return this.store
      .listApprovalMatrixRules();
  }

  getRule(
    id: string,
  ): GovernanceApprovalMatrixRule {
    const item =
      this.store
        .getApprovalMatrixRule(id);

    if (!item) {
      throw new NotFoundException(
        `Approval matrix rule ${id} was not found`,
      );
    }

    return item;
  }

  evaluate(
    request:
      GovernanceRequest,
  ): GovernanceApprovalMatrixDecision {
    const risk =
      request.evaluatedRiskLevel ??
      request.requestedRiskLevel;

    const matched =
      this.listRules()
        .filter(
          (rule) =>
            rule.enabled &&
            (
              !rule.environment ||
              rule.environment ===
                request.environment
            ) &&
            rule.requestTypes.includes(
              request.type,
            ) &&
            this.isRiskWithinRange(
              risk,
              rule.minimumRiskLevel,
              rule.maximumRiskLevel,
            ) &&
            (
              rule.minimumBlastRadius ===
                undefined ||
              (
                request.blastRadius ??
                0
              ) >=
                rule.minimumBlastRadius
            ) &&
            (
              rule.minimumBusinessCriticality ===
                undefined ||
              (
                request.businessCriticality ??
                0
              ) >=
                rule.minimumBusinessCriticality
            ) &&
            (
              !rule.rollbackPlanRequired ||
              request.rollbackPlanAvailable
            ) &&
            (
              rule.minimumTestCoverage ===
                undefined ||
              (
                request.testCoverage ??
                0
              ) >=
                rule.minimumTestCoverage
            ),
        )
        .sort(
          (a, b) =>
            b.priority - a.priority,
        );

    const tier =
      matched[0]?.tier ??
      GovernanceApprovalTier.STANDARD;

    const requiredApprovals =
      matched.length === 0
        ? request.approvalsRequired
        : Math.max(
            ...matched.map(
              (rule) =>
                rule.requiredApprovals,
            ),
          );

    const requiredRoles =
      Array.from(
        new Set(
          matched.flatMap(
            (rule) =>
              rule.requiredRoles,
          ),
        ),
      );

    return {
      requestId:
        request.id,
      tier,
      requiredApprovals,
      requiredRoles,
      matchedRuleIds:
        matched.map(
          (rule) => rule.id,
        ),
      reasons:
        matched.length > 0
          ? matched.map(
              (rule) =>
                `Matched approval rule: ${rule.name}`,
            )
          : [
              "No explicit approval matrix rule matched",
            ],
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  private isRiskWithinRange(
    value: GovernanceRiskLevel,
    minimum: GovernanceRiskLevel,
    maximum: GovernanceRiskLevel,
  ): boolean {
    const rank:
      Record<
        GovernanceRiskLevel,
        number
      > = {
      [GovernanceRiskLevel.INFORMATIONAL]: 0,
      [GovernanceRiskLevel.LOW]: 1,
      [GovernanceRiskLevel.MEDIUM]: 2,
      [GovernanceRiskLevel.HIGH]: 3,
      [GovernanceRiskLevel.CRITICAL]: 4,
    };

    return (
      rank[value] >=
        rank[minimum] &&
      rank[value] <=
        rank[maximum]
    );
  }
}
