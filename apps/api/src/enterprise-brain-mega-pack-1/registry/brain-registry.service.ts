import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainRegistryEntry } from "../enterprise-brain-mega-pack-1.types";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainRegistryService {
  private readonly entries =
    new Map<string, BrainRegistryEntry>();

  constructor(
    private readonly audit: BrainAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.entries.values());
  }

  get(id: string) {
    const entry = this.entries.get(id);

    if (!entry) {
      throw new NotFoundException(
        `Enterprise Brain registry entry not found: ${id}`
      );
    }

    return entry;
  }

  register(
    input: Omit<BrainRegistryEntry, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.entries.has(input.id)) {
      throw new ConflictException(
        `Enterprise Brain registry entry already exists: ${input.id}`
      );
    }

    const now = new Date().toISOString();

    const entry: BrainRegistryEntry = {
      ...input,
      capabilities:
        Array.from(new Set(input.capabilities)),
      dependencies:
        Array.from(new Set(input.dependencies)),
      createdAt: now,
      updatedAt: now
    };

    this.entries.set(entry.id, entry);

    this.audit.record({
      correlationId: context.correlationId,
      category: "registry",
      action: "enterprise-brain-registry-entry-created",
      subjectId: entry.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        type: entry.type,
        version: entry.version
      }
    });

    return entry;
  }

  summary() {
    const entries = this.list();

    return {
      total: entries.length,
      active: entries.filter((x) => x.active).length,
      services: entries.filter((x) => x.type === "service").length,
      capabilities:
        new Set(
          entries.flatMap(
            (entry) => entry.capabilities
          )
        ).size
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const entries: BrainRegistryEntry[] = [
      {
        id: "enterprise-brain:runtime",
        type: "runtime",
        name: "Enterprise Brain Runtime",
        version: "1.0.0",
        active: true,
        capabilities: [
          "brain.runtime",
          "brain.safe-mode"
        ],
        dependencies: [
          "enterprise-kernel"
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "enterprise-brain:context",
        type: "service",
        name: "Enterprise Brain Context Service",
        version: "1.0.0",
        active: true,
        capabilities: [
          "brain.context",
          "brain.context-resolution"
        ],
        dependencies: [
          "enterprise-brain:runtime"
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "enterprise-brain:intent",
        type: "service",
        name: "Enterprise Brain Intent Service",
        version: "1.0.0",
        active: true,
        capabilities: [
          "brain.intent",
          "brain.entity-detection"
        ],
        dependencies: [
          "enterprise-brain:context"
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "enterprise-brain:goal",
        type: "service",
        name: "Enterprise Brain Goal Service",
        version: "1.0.0",
        active: true,
        capabilities: [
          "brain.goals",
          "brain.goal-tracking"
        ],
        dependencies: [
          "enterprise-brain:intent"
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "enterprise-brain:decision",
        type: "service",
        name: "Enterprise Brain Decision Service",
        version: "1.0.0",
        active: true,
        capabilities: [
          "brain.decisions",
          "brain.human-approval"
        ],
        dependencies: [
          "enterprise-brain:goal",
          "enterprise-brain:context"
        ],
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const entry of entries) {
      this.entries.set(entry.id, entry);
    }
  }
}
