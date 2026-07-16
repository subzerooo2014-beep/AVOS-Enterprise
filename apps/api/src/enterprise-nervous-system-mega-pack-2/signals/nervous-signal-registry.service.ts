import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousSignalDefinition } from "../enterprise-nervous-system-mega-pack-2.types";
import { NervousRoutingAuditService } from "../observability/nervous-routing-audit.service";

@Injectable()
export class NervousSignalRegistryService {
  private readonly definitions =
    new Map<string, NervousSignalDefinition>();

  constructor(
    private readonly audit: NervousRoutingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.definitions.values());
  }

  get(id: string) {
    const definition = this.definitions.get(id);

    if (!definition) {
      throw new NotFoundException(`Nervous signal definition not found: ${id}`);
    }

    return definition;
  }

  register(
    input: Omit<NervousSignalDefinition, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.definitions.has(input.id)) {
      throw new ConflictException(
        `Nervous signal definition already exists: ${input.id}`
      );
    }

    const duplicate = this.list().find(
      (item) =>
        item.name.toLowerCase() === input.name.toLowerCase() &&
        item.topic === input.topic
    );

    if (duplicate) {
      throw new ConflictException(
        `Nervous signal definition duplicate: ${duplicate.id}`
      );
    }

    const now = new Date().toISOString();

    const definition: NervousSignalDefinition = {
      ...input,
      retentionHours: Math.max(1, input.retentionHours),
      createdAt: now,
      updatedAt: now
    };

    this.definitions.set(definition.id, definition);

    this.audit.record({
      correlationId: context.correlationId,
      category: "signal",
      action: "nervous-signal-definition-registered",
      subjectId: definition.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        topic: definition.topic,
        severity: definition.severity
      }
    });

    return definition;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      critical:
        items.filter((x) => x.severity === "critical").length,
      traceRequired:
        items.filter((x) => x.requiresTrace).length,
      approvalRequired:
        items.filter((x) => x.requiresHumanApproval).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const items: NervousSignalDefinition[] = [
      {
        id: "signal:platform-health",
        name: "Platform Health Signal",
        description: "Reports platform health state changes.",
        domain: "platform",
        category: "health",
        topic: "avos.system.health",
        severity: "notice",
        schema: { type: "object" },
        defaultHeaders: {},
        retentionHours: 168,
        active: true,
        requiresTrace: true,
        requiresHumanApproval: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "signal:brain-decision",
        name: "Enterprise Brain Decision Signal",
        description: "Reports Enterprise Brain decision lifecycle changes.",
        domain: "brain",
        category: "decision",
        topic: "avos.brain.decisions",
        severity: "info",
        schema: { type: "object" },
        defaultHeaders: {},
        retentionHours: 720,
        active: true,
        requiresTrace: true,
        requiresHumanApproval: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "signal:critical-governance",
        name: "Critical Governance Signal",
        description: "Reports critical governance violations.",
        domain: "governance",
        category: "violation",
        topic: "avos.governance.critical",
        severity: "critical",
        schema: { type: "object" },
        defaultHeaders: {},
        retentionHours: 2160,
        active: true,
        requiresTrace: true,
        requiresHumanApproval: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const item of items) {
      this.definitions.set(item.id, item);
    }
  }
}
