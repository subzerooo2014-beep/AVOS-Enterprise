import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  EnterpriseMemorySensitivity,
  EnterpriseMemoryType,
  MemoryRetentionPolicy,
  RetentionAction
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryRetentionPolicyService {
  private readonly policies =
    new Map<string, MemoryRetentionPolicy>([
      [
        "memory-retention:default",
        {
          id: "memory-retention:default",
          name: "Default Enterprise Memory Retention",
          description:
            "Baseline retention for enterprise memory records.",
          memoryTypes: [
            "operational",
            "architectural",
            "decision",
            "knowledge",
            "capability",
            "workflow",
            "incident",
            "learning",
            "context"
          ],
          sensitivityLevels: [
            "public",
            "internal",
            "confidential",
            "restricted"
          ],
          retentionDays: 3650,
          archiveAfterDays: 365,
          actionAfterRetention: "archive",
          legalHold: false,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    ]);

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.policies.values());
  }

  get(id: string) {
    const policy = this.policies.get(id);

    if (!policy) {
      throw new NotFoundException(
        `Memory retention policy not found: ${id}`
      );
    }

    return policy;
  }

  register(input: {
    id: string;
    name: string;
    description: string;
    memoryTypes: EnterpriseMemoryType[];
    sensitivityLevels: EnterpriseMemorySensitivity[];
    retentionDays: number;
    archiveAfterDays?: number;
    actionAfterRetention: RetentionAction;
    legalHold: boolean;
    active: boolean;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();

    const policy: MemoryRetentionPolicy = {
      id: input.id,
      name: input.name,
      description: input.description,
      memoryTypes: Array.from(
        new Set(input.memoryTypes)
      ),
      sensitivityLevels: Array.from(
        new Set(input.sensitivityLevels)
      ),
      retentionDays: Math.max(
        1,
        Math.round(input.retentionDays)
      ),
      archiveAfterDays:
        input.archiveAfterDays === undefined
          ? undefined
          : Math.max(
              1,
              Math.round(input.archiveAfterDays)
            ),
      actionAfterRetention:
        input.actionAfterRetention,
      legalHold: input.legalHold,
      active: input.active,
      createdAt: now,
      updatedAt: now
    };

    this.policies.set(policy.id, policy);

    this.audit.record({
      correlationId: input.correlationId,
      category: "retention",
      action: "retention-policy-registered",
      subjectId: policy.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        retentionDays: policy.retentionDays,
        actionAfterRetention:
          policy.actionAfterRetention
      }
    });

    return policy;
  }

  evaluate(input: {
    asOf?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const asOf = input.asOf
      ? new Date(input.asOf)
      : new Date();

    const actions: Array<{
      memoryId: string;
      policyId: string;
      action: RetentionAction;
    }> = [];

    for (const memory of this.memories.list()) {
      const policy = memory.retentionPolicyId
        ? this.get(memory.retentionPolicyId)
        : this.get("memory-retention:default");

      if (!policy.active || policy.legalHold) {
        continue;
      }

      if (
        !policy.memoryTypes.includes(memory.type) ||
        !policy.sensitivityLevels.includes(
          memory.sensitivity
        )
      ) {
        continue;
      }

      const ageDays =
        (asOf.getTime() -
          new Date(memory.createdAt).getTime()) /
        86400000;

      if (
        policy.archiveAfterDays !== undefined &&
        ageDays >= policy.archiveAfterDays &&
        memory.status === "active"
      ) {
        this.memories.updateStatus(
          memory.id,
          "archived",
          {
            actorIdentityId: input.actorIdentityId,
            correlationId: input.correlationId
          }
        );

        actions.push({
          memoryId: memory.id,
          policyId: policy.id,
          action: "archive"
        });

        continue;
      }

      if (ageDays >= policy.retentionDays) {
        if (policy.actionAfterRetention === "expire") {
          this.memories.updateStatus(
            memory.id,
            "expired",
            {
              actorIdentityId: input.actorIdentityId,
              correlationId: input.correlationId
            }
          );
        }
        else if (
          policy.actionAfterRetention === "delete"
        ) {
          this.memories.updateStatus(
            memory.id,
            "deleted",
            {
              actorIdentityId: input.actorIdentityId,
              correlationId: input.correlationId
            }
          );
        }
        else if (
          policy.actionAfterRetention === "archive"
        ) {
          this.memories.updateStatus(
            memory.id,
            "archived",
            {
              actorIdentityId: input.actorIdentityId,
              correlationId: input.correlationId
            }
          );
        }

        actions.push({
          memoryId: memory.id,
          policyId: policy.id,
          action: policy.actionAfterRetention
        });
      }
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "retention",
      action: "retention-evaluated",
      subjectId: "enterprise-memory",
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        actions: actions.length,
        asOf: asOf.toISOString()
      }
    });

    return {
      actions,
      evaluatedAt: new Date().toISOString()
    };
  }

  summary() {
    const policies = this.list();

    return {
      total: policies.length,
      active: policies.filter(
        (policy) => policy.active
      ).length,
      legalHold: policies.filter(
        (policy) => policy.legalHold
      ).length
    };
  }
}
