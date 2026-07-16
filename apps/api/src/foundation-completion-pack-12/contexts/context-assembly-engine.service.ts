import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { MemoryContext } from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryRetrievalEngineService } from "../retrieval/memory-retrieval-engine.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class ContextAssemblyEngineService {
  private readonly contexts =
    new Map<string, MemoryContext>();

  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly retrieval: MemoryRetrievalEngineService,
    private readonly audit: MemoryAuditService
  ) {}

  list() {
    return Array.from(this.contexts.values());
  }

  get(id: string) {
    const context = this.contexts.get(id);

    if (!context) {
      throw new NotFoundException(
        `Memory context not found: ${id}`
      );
    }

    return context;
  }

  assemble(input: {
    name: string;
    purpose: string;
    correlationId: string;
    assembledByIdentityId: string;
    memoryIds?: string[];
    retrievalQuery?: Parameters<
      MemoryRetrievalEngineService["search"]
    >[0];
    tokenBudget?: number;
    metadata?: Record<string, unknown>;
  }) {
    const memoryIds = new Set(input.memoryIds ?? []);
    const relevanceScores: Record<string, number> = {};

    for (const memoryId of memoryIds) {
      this.memories.get(memoryId);
      relevanceScores[memoryId] = 100;
    }

    if (input.retrievalQuery) {
      const result = this.retrieval.search(
        input.retrievalQuery,
        {
          actorIdentityId: input.assembledByIdentityId,
          correlationId: input.correlationId
        }
      );

      for (const item of result.results) {
        memoryIds.add(item.memory.id);
        relevanceScores[item.memory.id] = item.score;
      }
    }

    const context: MemoryContext = {
      id: `memory-context:${Date.now()}:${
        this.contexts.size + 1
      }`,
      name: input.name,
      purpose: input.purpose,
      correlationId: input.correlationId,
      memoryIds: Array.from(memoryIds),
      assembledByIdentityId:
        input.assembledByIdentityId,
      relevanceScores,
      tokenBudget: input.tokenBudget,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.contexts.set(context.id, context);

    this.audit.record({
      correlationId: context.correlationId,
      category: "context",
      action: "memory-context-assembled",
      subjectId: context.id,
      actorIdentityId: context.assembledByIdentityId,
      outcome: "success",
      metadata: {
        memories: context.memoryIds.length,
        tokenBudget: context.tokenBudget
      }
    });

    return {
      context,
      memories: context.memoryIds.map((id) =>
        this.memories.get(id)
      )
    };
  }

  summary() {
    const contexts = this.list();

    return {
      total: contexts.length,
      averageMemories:
        contexts.length === 0
          ? 0
          : Number(
              (
                contexts.reduce(
                  (sum, context) =>
                    sum + context.memoryIds.length,
                  0
                ) / contexts.length
              ).toFixed(2)
            )
    };
  }
}
