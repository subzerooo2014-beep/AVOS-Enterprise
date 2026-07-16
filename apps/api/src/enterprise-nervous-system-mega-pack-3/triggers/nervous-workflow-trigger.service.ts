import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousWorkflowTrigger } from "../enterprise-nervous-system-mega-pack-3.types";
import { NervousWorkflowRegistryService } from "../registry/nervous-workflow-registry.service";
import { NervousWorkflowAuditService } from "../observability/nervous-workflow-audit.service";

@Injectable()
export class NervousWorkflowTriggerService {
  private readonly triggers =
    new Map<string, NervousWorkflowTrigger>();

  constructor(
    private readonly workflows: NervousWorkflowRegistryService,
    private readonly audit: NervousWorkflowAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.triggers.values());
  }

  get(id: string) {
    const trigger = this.triggers.get(id);

    if (!trigger) {
      throw new NotFoundException(`Nervous workflow trigger not found: ${id}`);
    }

    return trigger;
  }

  register(
    input: Omit<NervousWorkflowTrigger, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.triggers.has(input.id)) {
      throw new ConflictException(
        `Nervous workflow trigger already exists: ${input.id}`
      );
    }

    this.workflows.get(input.workflowId);

    const now = new Date().toISOString();

    const trigger: NervousWorkflowTrigger = {
      ...input,
      conditions: input.conditions.map((condition) => ({ ...condition })),
      createdAt: now,
      updatedAt: now
    };

    this.triggers.set(trigger.id, trigger);

    this.audit.record({
      correlationId: context.correlationId,
      category: "trigger",
      action: "nervous-workflow-trigger-registered",
      subjectId: trigger.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        workflowId: trigger.workflowId,
        topicPattern: trigger.topicPattern
      }
    });

    return trigger;
  }

  match(input: {
    topic: string;
    signalDefinitionId?: string;
    payload: unknown;
  }) {
    return this.list()
      .filter((trigger) => trigger.active)
      .filter(
        (trigger) =>
          this.topicMatches(trigger.topicPattern, input.topic)
      )
      .filter(
        (trigger) =>
          !trigger.signalDefinitionId ||
          trigger.signalDefinitionId === input.signalDefinitionId
      )
      .filter(
        (trigger) =>
          trigger.conditions.every((condition) =>
            this.evaluateCondition(input.payload, condition)
          )
      );
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length
    };
  }

  private topicMatches(pattern: string, topic: string) {
    if (pattern === topic) return true;

    if (pattern.endsWith(".*")) {
      return topic.startsWith(pattern.slice(0, -1));
    }

    return false;
  }

  private evaluateCondition(
    payload: unknown,
    condition: NervousWorkflowTrigger["conditions"][number]
  ) {
    const value = this.readField(payload, condition.field);

    switch (condition.operator) {
      case "eq":
        return value === condition.value;
      case "neq":
        return value !== condition.value;
      case "contains":
        return String(value ?? "").includes(String(condition.value ?? ""));
      case "gt":
        return Number(value) > Number(condition.value);
      case "gte":
        return Number(value) >= Number(condition.value);
      case "lt":
        return Number(value) < Number(condition.value);
      case "lte":
        return Number(value) <= Number(condition.value);
      default:
        return false;
    }
  }

  private readField(payload: unknown, path: string) {
    const segments = path.split(".");
    let current = payload;

    for (const segment of segments) {
      if (
        current === null ||
        typeof current !== "object"
      ) {
        return undefined;
      }

      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }

  private seed() {
    const now = new Date().toISOString();

    const trigger: NervousWorkflowTrigger = {
      id: "trigger:critical-governance-response",
      name: "Critical Governance Trigger",
      workflowId: "workflow:critical-governance-response",
      topicPattern: "avos.governance.*",
      signalDefinitionId: "signal:critical-governance",
      conditions: [],
      active: true,
      createdAt: now,
      updatedAt: now
    };

    this.triggers.set(trigger.id, trigger);
  }
}
