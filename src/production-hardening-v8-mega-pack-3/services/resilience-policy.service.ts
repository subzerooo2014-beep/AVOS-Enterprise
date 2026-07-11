import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  JsonValue,
  ResiliencePolicy,
  RuntimeActor,
} from "../contracts/runtime-resilience.contracts";
import {
  EvidenceEntryType,
  ResiliencePolicyStatus,
} from "../contracts/runtime-resilience.enums";
import { CreateResiliencePolicyDto } from "../dto";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class ResiliencePolicyService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  create(dto: CreateResiliencePolicyDto): ResiliencePolicy {
    const existing = this.store.findPoliciesByKey(dto.key);

    const version =
      existing.length === 0
        ? 1
        : Math.max(...existing.map((item) => item.version)) + 1;

    const now = new Date().toISOString();

    const policy: ResiliencePolicy = {
      id: randomUUID(),
      key: dto.key,
      name: dto.name,
      description: dto.description,
      version,
      status: ResiliencePolicyStatus.DRAFT,
      environment: dto.environment,
      namespace: dto.namespace,
      rules: dto.rules
        .map((rule) => ({
          id: rule.id,
          name: rule.name,
          description: rule.description,
          priority: rule.priority,
          enabled: rule.enabled,
          conditions: rule.conditions.map((condition) => ({
            field: condition.field,
            operator: condition.operator,
            value: condition.value as JsonValue,
          })),
          decision: rule.decision,
          riskLevel: rule.riskLevel,
          requiredApprovals: rule.requiredApprovals,
          actionTypes: rule.actionTypes,
          metadata: (rule.metadata ?? {}) as Record<
            string,
            JsonValue
          >,
        }))
        .sort((a, b) => b.priority - a.priority),
      defaultDecision: dto.defaultDecision,
      defaultRiskLevel: dto.defaultRiskLevel,
      createdBy: dto.actor,
      createdAt: now,
      updatedAt: now,
    };

    const saved = this.store.savePolicy(policy);

    this.evidence.append({
      type: EvidenceEntryType.POLICY_CREATED,
      aggregateType: "resilience_policy",
      aggregateId: saved.id,
      actor: dto.actor,
      payload: {
        policyId: saved.id,
        key: saved.key,
        version: saved.version,
        status: saved.status,
        rules: saved.rules.length,
      },
    });

    return saved;
  }

  list(): ResiliencePolicy[] {
    return this.store.listPolicies();
  }

  get(id: string): ResiliencePolicy {
    const policy = this.store.getPolicy(id);

    if (!policy) {
      throw new NotFoundException(
        `Resilience policy ${id} was not found`,
      );
    }

    return policy;
  }

  activate(id: string, actor: RuntimeActor): ResiliencePolicy {
    const policy = this.get(id);

    if (policy.status !== ResiliencePolicyStatus.DRAFT) {
      throw new BadRequestException(
        `Only draft policies can be activated. Current status: ${policy.status}`,
      );
    }

    const now = new Date().toISOString();

    const activeVersions = this.store
      .findPoliciesByKey(policy.key)
      .filter(
        (item) =>
          item.status === ResiliencePolicyStatus.ACTIVE &&
          item.id !== policy.id,
      );

    for (const active of activeVersions) {
      active.status = ResiliencePolicyStatus.ARCHIVED;
      active.archivedAt = now;
      active.updatedAt = now;
      this.store.savePolicy(active);
    }

    policy.status = ResiliencePolicyStatus.ACTIVE;
    policy.activatedAt = now;
    policy.updatedAt = now;

    const saved = this.store.savePolicy(policy);

    this.evidence.append({
      type: EvidenceEntryType.POLICY_ACTIVATED,
      aggregateType: "resilience_policy",
      aggregateId: saved.id,
      actor,
      payload: {
        policyId: saved.id,
        key: saved.key,
        version: saved.version,
        archivedPolicyIds: activeVersions.map((item) => item.id),
      },
    });

    return saved;
  }

  disable(id: string, actor: RuntimeActor): ResiliencePolicy {
    const policy = this.get(id);

    if (policy.status !== ResiliencePolicyStatus.ACTIVE) {
      throw new BadRequestException(
        `Only active policies can be disabled. Current status: ${policy.status}`,
      );
    }

    const now = new Date().toISOString();

    policy.status = ResiliencePolicyStatus.DISABLED;
    policy.disabledAt = now;
    policy.updatedAt = now;

    const saved = this.store.savePolicy(policy);

    this.evidence.append({
      type: EvidenceEntryType.POLICY_ACTIVATED,
      aggregateType: "resilience_policy",
      aggregateId: saved.id,
      actor,
      payload: {
        policyId: saved.id,
        status: saved.status,
        operation: "disabled",
      },
    });

    return saved;
  }
}
