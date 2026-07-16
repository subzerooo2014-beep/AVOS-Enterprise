import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainMemoryConsolidation,
  BrainMemoryRecord
} from "../enterprise-brain-mega-pack-2.types";
import { BrainMemoryStoreService } from "../memory/brain-memory-store.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainMemoryConsolidationService {
  private readonly jobs =
    new Map<string, BrainMemoryConsolidation>();

  constructor(
    private readonly memory: BrainMemoryStoreService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  list() {
    return Array.from(this.jobs.values());
  }

  get(id: string) {
    const job = this.jobs.get(id);

    if (!job) {
      throw new NotFoundException(
        `Brain memory consolidation not found: ${id}`
      );
    }

    return job;
  }

  plan(input: {
    sourceMemoryIds: string[];
    strategy: BrainMemoryConsolidation["strategy"];
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (input.sourceMemoryIds.length < 1) {
      throw new ConflictException(
        "Brain memory consolidation requires at least one source memory."
      );
    }

    const sources = input.sourceMemoryIds.map(
      (id) => this.memory.get(id)
    );

    const target = this.memory.create(
      {
        type:
          input.strategy === "promote"
            ? "long-term"
            : "semantic",
        subject:
          `Consolidated: ${sources.map((item) => item.subject).join(" | ")}`,
        content:
          sources.map((item) => item.content),
        summary:
          sources.map((item) => item.summary).join(" "),
        tags:
          Array.from(new Set(sources.flatMap((item) => item.tags))),
        relatedKnowledgeNodeIds:
          Array.from(
            new Set(
              sources.flatMap(
                (item) => item.relatedKnowledgeNodeIds
              )
            )
          ),
        importance:
          Math.round(
            sources.reduce(
              (sum, item) => sum + item.importance,
              0
            ) / sources.length
          ),
        confidence:
          Math.round(
            sources.reduce(
              (sum, item) => sum + item.confidence,
              0
            ) / sources.length
          ),
        retentionScore:
          Math.max(
            ...sources.map((item) => item.retentionScore)
          ),
        sensitive:
          sources.some((item) => item.sensitive),
        ownerIdentityId:
          sources[0]?.ownerIdentityId,
        sessionId:
          sources[0]?.sessionId,
        organizationId:
          sources[0]?.organizationId,
        status: "consolidating"
      },
      {
        actorIdentityId: input.actorIdentityId,
        correlationId: input.correlationId
      }
    );

    const job: BrainMemoryConsolidation = {
      id: `brain-memory-consolidation:${Date.now()}:${this.jobs.size + 1}`,
      sourceMemoryIds: Array.from(new Set(input.sourceMemoryIds)),
      targetMemoryId: target.id,
      strategy: input.strategy,
      status: "planned",
      createdAt: new Date().toISOString()
    };

    this.jobs.set(job.id, job);

    return {
      job,
      target
    };
  }

  execute(input: {
    consolidationId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.consolidationId);

    const running: BrainMemoryConsolidation = {
      ...current,
      status: "running"
    };

    this.jobs.set(running.id, running);

    try {
      const target = this.memory.get(running.targetMemoryId);

      this.memory.update(target.id, {
        status: "active",
        updatedAt: new Date().toISOString()
      });

      if (running.strategy === "archive") {
        for (const sourceId of running.sourceMemoryIds) {
          this.memory.archive({
            memoryId: sourceId,
            actorIdentityId: input.actorIdentityId,
            correlationId: input.correlationId
          });
        }
      }

      const completed: BrainMemoryConsolidation = {
        ...running,
        status: "completed",
        completedAt: new Date().toISOString()
      };

      this.jobs.set(completed.id, completed);

      this.audit.record({
        correlationId: input.correlationId,
        category: "consolidation",
        action: "brain-memory-consolidation-completed",
        subjectId: completed.id,
        actorIdentityId: input.actorIdentityId,
        outcome: "success",
        metadata: {
          strategy: completed.strategy,
          sourceCount: completed.sourceMemoryIds.length
        }
      });

      return completed;
    }
    catch (error) {
      const failed: BrainMemoryConsolidation = {
        ...running,
        status: "failed",
        completedAt: new Date().toISOString()
      };

      this.jobs.set(failed.id, failed);
      return failed;
    }
  }

  summary() {
    const jobs = this.list();

    return {
      total: jobs.length,
      planned: jobs.filter((x) => x.status === "planned").length,
      running: jobs.filter((x) => x.status === "running").length,
      completed: jobs.filter((x) => x.status === "completed").length,
      failed: jobs.filter((x) => x.status === "failed").length
    };
  }
}
