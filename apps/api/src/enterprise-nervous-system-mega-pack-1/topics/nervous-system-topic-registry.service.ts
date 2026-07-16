import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousSystemTopic } from "../enterprise-nervous-system-mega-pack-1.types";
import { NervousSystemAuditService } from "../observability/nervous-system-audit.service";

@Injectable()
export class NervousSystemTopicRegistryService {
  private readonly topics =
    new Map<string, NervousSystemTopic>();

  constructor(
    private readonly audit: NervousSystemAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.topics.values());
  }

  get(idOrName: string) {
    const topic =
      this.topics.get(idOrName) ??
      this.list().find((item) => item.name === idOrName);

    if (!topic) {
      throw new NotFoundException(
        `Nervous System topic not found: ${idOrName}`
      );
    }

    return topic;
  }

  register(
    input: Omit<NervousSystemTopic, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (
      this.topics.has(input.id) ||
      this.list().some((topic) => topic.name === input.name)
    ) {
      throw new ConflictException(
        `Nervous System topic already exists: ${input.name}`
      );
    }

    const now = new Date().toISOString();

    const topic: NervousSystemTopic = {
      ...input,
      partitions: Math.max(1, input.partitions),
      retentionHours: Math.max(1, input.retentionHours),
      createdAt: now,
      updatedAt: now
    };

    this.topics.set(topic.id, topic);

    this.audit.record({
      correlationId: context.correlationId,
      category: "topic",
      action: "nervous-system-topic-registered",
      subjectId: topic.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        name: topic.name,
        durable: topic.durable
      }
    });

    return topic;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      durable: items.filter((x) => x.durable).length,
      ordered: items.filter((x) => x.ordered).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const topics: NervousSystemTopic[] = [
      {
        id: "topic:avos-platform-events",
        name: "avos.platform.events",
        description: "Core AVOS platform events.",
        partitions: 8,
        retentionHours: 168,
        durable: true,
        ordered: false,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "topic:avos-brain-decisions",
        name: "avos.brain.decisions",
        description: "Enterprise Brain decision lifecycle events.",
        partitions: 4,
        retentionHours: 720,
        durable: true,
        ordered: true,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "topic:avos-system-health",
        name: "avos.system.health",
        description: "Platform health and diagnostic signals.",
        partitions: 2,
        retentionHours: 168,
        durable: true,
        ordered: false,
        active: true,
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const topic of topics) {
      this.topics.set(topic.id, topic);
    }
  }
}
