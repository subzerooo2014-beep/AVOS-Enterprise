import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AvosQuery } from "./query.interface";
import { QueryHandler } from "./query-handler.interface";

@Injectable()
export class QueryBusService {
  private handlers: QueryHandler[] = [];

  constructor(private readonly prisma: PrismaService) {}

  register(handler: QueryHandler) {
    this.handlers.push(handler);
  }

  async execute(query: AvosQuery) {
    if (!query?.type) {
      throw new BadRequestException("Query type is required");
    }

    await this.logQuery(query, "received");

    const handler = this.handlers.find((h) => h.supports(query));

    if (!handler) {
      await this.logQuery(query, "no_handler");
      return {
        status: "no_handler",
        queryType: query.type,
        message: "No handler registered for this query yet.",
      };
    }

    try {
      const result = await handler.handle(query);
      await this.logQuery(query, "completed", { count: Array.isArray(result) ? result.length : 1 });
      return result;
    } catch (error: unknown) {
      await this.logQuery(query, "failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  private async logQuery(query: AvosQuery, status: string, result: any = {}) {
    try {
      await (this.prisma as any).platformEvent.create({
        data: {
          type: `Query:${query.type}`,
          source: query.source || "query-bus",
          entityType: query.metadata?.entityType,
          entityId: query.metadata?.entityId,
          status,
          payload: query.filters || {},
          result: {
            correlationId: query.correlationId || null,
            metadata: query.metadata || {},
            ...result,
          },
        },
      });
    } catch (error: unknown) {
      console.error("Query log failed:", error instanceof Error ? error.message : String(error));
    }
  }
}
