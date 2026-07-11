import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  ResiliencePolicy,
  RuntimeRiskEvaluation,
  RuntimeRiskFactor,
} from "../contracts/runtime-resilience.contracts";
import {
  EvidenceEntryType,
  ResiliencePolicyStatus,
  RuntimeChangeType,
  RuntimeDecision,
  RuntimeEnvironment,
  RuntimeRiskLevel,
} from "../contracts/runtime-resilience.enums";
import { EvaluateRuntimeRiskDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import {
  clampScore,
  decisionFromRiskLevel,
  requiredApprovalsFromRiskLevel,
  riskLevelFromScore,
} from "../utils/runtime-risk.util";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";
import { ResiliencePolicyEvaluatorService } from "./resilience-policy-evaluator.service";

@Injectable()
export class RuntimeRiskEvaluationService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
    private readonly evaluator: ResiliencePolicyEvaluatorService,
  ) {}

  evaluate(dto: EvaluateRuntimeRiskDto): RuntimeRiskEvaluation {
    const policy = this.resolvePolicy(dto);

    const factors = this.buildRiskFactors(dto);
    const baseScore = clampScore(
      factors.reduce(
        (sum, factor) => sum + factor.weightedScore,
        0,
      ),
    );

    const context = {
      ...dto.context,
      environment: dto.environment,
      namespace: dto.namespace,
      changeType: dto.changeType,
      riskScore: baseScore,
    };

    const matchedRules = policy
      ? policy.rules.filter(
          (rule) =>
            rule.enabled &&
            this.evaluator.evaluateConditions(
              rule.conditions,
              context,
            ),
        )
      : [];

    const highestPriorityRule = matchedRules
      .slice()
      .sort((a, b) => b.priority - a.priority)[0];

    const riskLevel =
      highestPriorityRule?.riskLevel ??
      policy?.defaultRiskLevel ??
      riskLevelFromScore(baseScore);

    const decision =
      highestPriorityRule?.decision ??
      policy?.defaultDecision ??
      decisionFromRiskLevel(riskLevel);

    const requiredApprovals =
      highestPriorityRule?.requiredApprovals ??
      requiredApprovalsFromRiskLevel(riskLevel);

    const reasons = [
      ...factors.map((factor) => factor.reason),
      ...(highestPriorityRule
        ? [
            `Matched policy rule: ${highestPriorityRule.name}`,
          ]
        : ["No explicit policy rule matched"]),
    ];

    const evaluation: RuntimeRiskEvaluation = {
      id: randomUUID(),
      configurationId: dto.configurationId,
      policyId: policy?.id,
      environment: dto.environment,
      namespace: dto.namespace,
      changeType: dto.changeType,
      riskScore: baseScore,
      riskLevel,
      decision,
      factors,
      matchedRuleIds: matchedRules.map((rule) => rule.id),
      requiredApprovals,
      reasons,
      evaluatedBy: dto.actor,
      evaluatedAt: new Date().toISOString(),
      context: dto.context as Record<string, JsonValue>,
    };

    const saved = this.store.saveRiskEvaluation(evaluation);

    this.evidence.append({
      type: EvidenceEntryType.RISK_EVALUATED,
      aggregateType: "runtime_risk_evaluation",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        evaluationId: saved.id,
        configurationId: saved.configurationId ?? null,
        policyId: saved.policyId ?? null,
        riskScore: saved.riskScore,
        riskLevel: saved.riskLevel,
        decision: saved.decision,
        requiredApprovals: saved.requiredApprovals,
        matchedRuleIds: saved.matchedRuleIds,
      },
    });

    return saved;
  }

  list(): RuntimeRiskEvaluation[] {
    return this.store.listRiskEvaluations();
  }

  get(id: string): RuntimeRiskEvaluation {
    const evaluation = this.store.getRiskEvaluation(id);

    if (!evaluation) {
      throw new NotFoundException(
        `Runtime risk evaluation ${id} was not found`,
      );
    }

    return evaluation;
  }

  private resolvePolicy(
    dto: EvaluateRuntimeRiskDto,
  ): ResiliencePolicy | undefined {
    if (dto.policyId) {
      const policy = this.store.getPolicy(dto.policyId);

      if (!policy) {
        throw new NotFoundException(
          `Resilience policy ${dto.policyId} was not found`,
        );
      }

      return policy;
    }

    return this.store
      .listPolicies()
      .filter(
        (policy) =>
          policy.status === ResiliencePolicyStatus.ACTIVE &&
          (!policy.environment ||
            policy.environment === dto.environment) &&
          (!policy.namespace ||
            policy.namespace === dto.namespace),
      )
      .sort((a, b) => b.version - a.version)[0];
  }

  private buildRiskFactors(
    dto: EvaluateRuntimeRiskDto,
  ): RuntimeRiskFactor[] {
    const factors: RuntimeRiskFactor[] = [];

    factors.push(
      this.createFactor(
        "environment",
        "Runtime environment",
        this.environmentScore(dto.environment),
        0.2,
        `Environment ${dto.environment} contributes deployment risk`,
      ),
    );

    factors.push(
      this.createFactor(
        "change_type",
        "Change type",
        this.changeTypeScore(dto.changeType),
        0.25,
        `Change type ${dto.changeType} contributes operational risk`,
      ),
    );

    const context = dto.context as Record<string, unknown>;

    factors.push(
      this.createFactor(
        "blast_radius",
        "Blast radius",
        this.numericContextScore(
          context.blastRadius,
          0,
          100,
          30,
        ),
        0.2,
        "Blast radius was evaluated from runtime context",
      ),
    );

    factors.push(
      this.createFactor(
        "rollback_readiness",
        "Rollback readiness",
        this.booleanInverseScore(
          context.rollbackReady,
          15,
          85,
        ),
        0.15,
        "Rollback readiness influences recovery risk",
      ),
    );

    factors.push(
      this.createFactor(
        "test_coverage",
        "Test coverage",
        this.inversePercentageScore(
          context.testCoverage,
          50,
        ),
        0.1,
        "Test coverage influences regression risk",
      ),
    );

    factors.push(
      this.createFactor(
        "active_incidents",
        "Active incidents",
        this.activeIncidentScore(context.activeIncidents),
        0.1,
        "Existing active incidents increase change risk",
      ),
    );

    return factors;
  }

  private createFactor(
    key: string,
    label: string,
    score: number,
    weight: number,
    reason: string,
  ): RuntimeRiskFactor {
    const normalizedScore = clampScore(score);

    return {
      key,
      label,
      score: normalizedScore,
      weight,
      weightedScore: Math.round(normalizedScore * weight),
      reason,
    };
  }

  private environmentScore(
    environment: RuntimeEnvironment,
  ): number {
    switch (environment) {
      case RuntimeEnvironment.PRODUCTION:
        return 90;

      case RuntimeEnvironment.STAGING:
        return 55;

      case RuntimeEnvironment.TEST:
        return 25;

      case RuntimeEnvironment.DEVELOPMENT:
      default:
        return 10;
    }
  }

  private changeTypeScore(changeType: RuntimeChangeType): number {
    switch (changeType) {
      case RuntimeChangeType.EMERGENCY:
        return 100;

      case RuntimeChangeType.SECURITY:
        return 90;

      case RuntimeChangeType.DATABASE:
        return 85;

      case RuntimeChangeType.INFRASTRUCTURE:
        return 80;

      case RuntimeChangeType.DEPLOYMENT:
        return 70;

      case RuntimeChangeType.INTEGRATION:
        return 65;

      case RuntimeChangeType.POLICY:
        return 60;

      case RuntimeChangeType.CONFIGURATION:
        return 45;

      case RuntimeChangeType.FEATURE_FLAG:
      default:
        return 30;
    }
  }

  private numericContextScore(
    value: unknown,
    minimum: number,
    maximum: number,
    fallback: number,
  ): number {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return fallback;
    }

    if (numberValue <= minimum) {
      return 0;
    }

    if (numberValue >= maximum) {
      return 100;
    }

    return (
      ((numberValue - minimum) / (maximum - minimum)) * 100
    );
  }

  private booleanInverseScore(
    value: unknown,
    trueScore: number,
    falseScore: number,
  ): number {
    if (value === true) {
      return trueScore;
    }

    if (value === false) {
      return falseScore;
    }

    return Math.round((trueScore + falseScore) / 2);
  }

  private inversePercentageScore(
    value: unknown,
    fallback: number,
  ): number {
    const percentage = Number(value);

    if (!Number.isFinite(percentage)) {
      return fallback;
    }

    return clampScore(100 - percentage);
  }

  private activeIncidentScore(value: unknown): number {
    const count = Number(value);

    if (!Number.isFinite(count) || count <= 0) {
      return 0;
    }

    if (count >= 5) {
      return 100;
    }

    return count * 20;
  }
}
