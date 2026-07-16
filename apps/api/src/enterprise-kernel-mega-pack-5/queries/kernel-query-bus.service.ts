import { Injectable } from "@nestjs/common";
import {
  KernelMessageEnvelope,
  KernelQueryResult
} from "../enterprise-kernel-mega-pack-5.types";
import { KernelMessageFactoryService } from "../contracts/kernel-message-factory.service";
import { KernelMessagingAuditService } from "../observability/kernel-messaging-audit.service";

@Injectable()
export class KernelQueryBusService {
  private readonly queries = new Map<string, KernelMessageEnvelope>();
  private readonly results = new Map<string, KernelQueryResult>();

  constructor(
    private readonly factory: KernelMessageFactoryService,
    private readonly audit: KernelMessagingAuditService
  ) {}

  execute(input: {
    contractId: string;
    payload: Record<string, unknown>;
    producerId: string;
    actorIdentityId: string;
    correlationId: string;
    traceId?: string;
  }) {
    const query = this.factory.create(input);

    if (query.kind !== "query") {
      throw new Error(`Kernel contract is not a query contract: ${query.contractId}`);
    }

    query.status = "processing";
    query.updatedAt = new Date().toISOString();

    this.queries.set(query.id, query);

    const result: KernelQueryResult = {
      id: `kernel-query-result:${Date.now()}:${this.results.size + 1}`,
      queryMessageId: query.id,
      handledBy: "kernel:runtime",
      success: true,
      data: {
        runtimeStatus: "available",
        requestedPayload: query.payload
      },
      completedAt: new Date().toISOString()
    };

    query.status = "completed";
    query.updatedAt = new Date().toISOString();

    this.queries.set(query.id, query);
    this.results.set(result.id, result);

    this.audit.record({
      correlationId: input.correlationId,
      category: "query",
      action: "kernel-query-executed",
      subjectId: query.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        resultId: result.id
      }
    });

    return {
      query,
      result
    };
  }

  listQueries() {
    return Array.from(this.queries.values());
  }

  listResults() {
    return Array.from(this.results.values());
  }

  summary() {
    return {
      queries: this.queries.size,
      results: this.results.size,
      successful: this.listResults().filter((x) => x.success).length
    };
  }
}
