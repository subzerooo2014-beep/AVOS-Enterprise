import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainRule } from "../enterprise-brain-mega-pack-3.types";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainRuleRegistryService {
  private readonly rules = new Map<string, BrainRule>();

  constructor(
    private readonly audit: BrainReasoningAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.rules.values());
  }

  get(id: string) {
    const rule = this.rules.get(id);

    if (!rule) {
      throw new NotFoundException(`Brain rule not found: ${id}`);
    }

    return rule;
  }

  register(
    input: Omit<BrainRule, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.rules.has(input.id)) {
      throw new ConflictException(`Brain rule already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const rule: BrainRule = {
      ...input,
      priority: Math.max(0, Math.min(100, input.priority)),
      createdAt: now,
      updatedAt: now
    };

    this.rules.set(rule.id, rule);

    this.audit.record({
      correlationId: context.correlationId,
      category: "rule",
      action: "brain-rule-registered",
      subjectId: rule.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        priority: rule.priority
      }
    });

    return rule;
  }

  summary() {
    const rules = this.list();

    return {
      total: rules.length,
      active: rules.filter((x) => x.active).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const rules: BrainRule[] = [
      {
        id: "brain-rule:foundation-first",
        name: "Foundation First",
        description: "Higher layers must not bypass foundation readiness.",
        expression: "foundationReady == true",
        priority: 100,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-rule:human-final-authority",
        name: "Human Final Authority",
        description: "High-risk decisions require human approval.",
        expression: "riskScore >= 70 => humanApproved == true",
        priority: 100,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-rule:rollback-by-design",
        name: "Rollback by Design",
        description: "Reversible execution requires rollback definition.",
        expression: "reversible == true => rollbackAvailable == true",
        priority: 95,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const rule of rules) {
      this.rules.set(rule.id, rule);
    }
  }
}
