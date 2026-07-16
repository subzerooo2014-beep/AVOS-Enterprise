import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainConstraint } from "../enterprise-brain-mega-pack-3.types";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainConstraintEngineService {
  private readonly constraints = new Map<string, BrainConstraint>();

  constructor(
    private readonly audit: BrainReasoningAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.constraints.values());
  }

  get(id: string) {
    const constraint = this.constraints.get(id);

    if (!constraint) {
      throw new NotFoundException(`Brain constraint not found: ${id}`);
    }

    return constraint;
  }

  register(
    input: Omit<BrainConstraint, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.constraints.has(input.id)) {
      throw new ConflictException(`Brain constraint already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const constraint: BrainConstraint = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.constraints.set(constraint.id, constraint);

    this.audit.record({
      correlationId: context.correlationId,
      category: "constraint",
      action: "brain-constraint-registered",
      subjectId: constraint.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        kind: constraint.kind,
        requiresHumanApproval: constraint.requiresHumanApproval
      }
    });

    return constraint;
  }

  evaluate(
    constraintIds: string[],
    context: Record<string, unknown>
  ) {
    const results = constraintIds.map((id) => {
      const constraint = this.get(id);
      const passed = this.evaluateOne(constraint, context);

      return {
        constraintId: constraint.id,
        passed,
        requiresHumanApproval:
          constraint.requiresHumanApproval,
        reason: passed
          ? "Constraint passed."
          : `Constraint failed: ${constraint.description}`
      };
    });

    return {
      passed: results.every((x) => x.passed),
      requiresHumanApproval:
        results.some(
          (x) =>
            x.requiresHumanApproval &&
            !x.passed
        ),
      results
    };
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      approvalConstraints:
        items.filter((x) => x.requiresHumanApproval).length
    };
  }

  private evaluateOne(
    constraint: BrainConstraint,
    context: Record<string, unknown>
  ) {
    if (!constraint.active) return true;

    if (constraint.kind === "approval") {
      return context["humanApproved"] === true;
    }

    if (constraint.kind === "dependency") {
      return constraint.dependencyId
        ? context[constraint.dependencyId] === true
        : false;
    }

    if (!constraint.field) {
      return true;
    }

    const actual = context[constraint.field];

    switch (constraint.operator) {
      case "eq":
        return actual === constraint.value;
      case "neq":
        return actual !== constraint.value;
      case "gt":
        return Number(actual) > Number(constraint.value);
      case "gte":
        return Number(actual) >= Number(constraint.value);
      case "lt":
        return Number(actual) < Number(constraint.value);
      case "lte":
        return Number(actual) <= Number(constraint.value);
      case "in":
        return Array.isArray(constraint.value) &&
          constraint.value.includes(actual);
      case "not-in":
        return Array.isArray(constraint.value) &&
          !constraint.value.includes(actual);
      default:
        return constraint.kind !== "forbidden";
    }
  }

  private seed() {
    const now = new Date().toISOString();

    const items: BrainConstraint[] = [
      {
        id: "brain-constraint:foundation-ready",
        name: "Foundation Ready",
        description: "Foundation must be certified.",
        kind: "required",
        field: "foundationReady",
        operator: "eq",
        value: true,
        requiresHumanApproval: false,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "brain-constraint:high-risk-approval",
        name: "High Risk Approval",
        description: "High-risk execution requires human approval.",
        kind: "approval",
        requiresHumanApproval: true,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of items) {
      this.constraints.set(item.id, item);
    }
  }
}
