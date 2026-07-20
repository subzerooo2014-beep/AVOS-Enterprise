import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AgsDurableIdService } from "./ags-durable-id.service";

@Injectable()
export class AgsDurableAuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ids: AgsDurableIdService,
  ) {}

  record(input: {
    action: string;
    actor: string;
    entityType: string;
    entityId: string;
    correlationId?: string;
    before?: unknown;
    after?: unknown;
    metadata?: Record<string, unknown>;
  }) {
    return (this.prisma as any).agsDurableAudit.create({
      data: {
        id: this.ids.create("ags-audit"),
        action: input.action,
        actor: input.actor,
        entityType: input.entityType,
        entityId: input.entityId,
        correlationId: input.correlationId,
        before: input.before,
        after: input.after,
        metadata: input.metadata ?? {},
      },
    });
  }

  list(entityType?: string, entityId?: string) {
    return (this.prisma as any).agsDurableAudit.findMany({
      where: {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }
}