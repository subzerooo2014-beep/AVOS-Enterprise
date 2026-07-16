import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { NervousStreamDefinition } from "../enterprise-nervous-system-mega-pack-4.types";
import { NervousStreamingAuditService } from "../observability/nervous-streaming-audit.service";

@Injectable()
export class NervousStreamRegistryService {
  private readonly streams =
    new Map<string, NervousStreamDefinition>();

  constructor(
    private readonly audit: NervousStreamingAuditService
  ) {
    this.seed();
  }

  list() {
    return Array.from(this.streams.values());
  }

  get(id: string) {
    const stream = this.streams.get(id);

    if (!stream) {
      throw new NotFoundException(`Nervous stream not found: ${id}`);
    }

    return stream;
  }

  register(
    input: Omit<NervousStreamDefinition, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.streams.has(input.id)) {
      throw new ConflictException(`Nervous stream already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const stream: NervousStreamDefinition = {
      ...input,
      partitions: Math.max(1, input.partitions),
      replicationFactor: Math.max(1, input.replicationFactor),
      retentionHours: Math.max(1, input.retentionHours),
      createdAt: now,
      updatedAt: now
    };

    this.streams.set(stream.id, stream);

    this.audit.record({
      correlationId: context.correlationId,
      category: "stream",
      action: "nervous-stream-registered",
      subjectId: stream.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        partitions: stream.partitions,
        replicationFactor: stream.replicationFactor
      }
    });

    return stream;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.status === "active").length,
      durable: items.filter((x) => x.durable).length,
      compacted: items.filter((x) => x.compacted).length,
      degraded: items.filter((x) => x.status === "degraded").length,
      offline: items.filter((x) => x.status === "offline").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const streams: NervousStreamDefinition[] = [
      {
        id: "stream:platform-events",
        name: "Platform Events Stream",
        topic: "avos.platform.events",
        partitions: 8,
        replicationFactor: 3,
        retentionHours: 168,
        compacted: false,
        ordered: false,
        durable: true,
        status: "active",
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "stream:brain-decisions",
        name: "Brain Decisions Stream",
        topic: "avos.brain.decisions",
        partitions: 4,
        replicationFactor: 3,
        retentionHours: 720,
        compacted: true,
        ordered: true,
        durable: true,
        status: "active",
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "stream:system-health",
        name: "System Health Stream",
        topic: "avos.system.health",
        partitions: 2,
        replicationFactor: 3,
        retentionHours: 168,
        compacted: true,
        ordered: false,
        durable: true,
        status: "active",
        metadata: { seeded: true },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const stream of streams) {
      this.streams.set(stream.id, stream);
    }
  }
}
