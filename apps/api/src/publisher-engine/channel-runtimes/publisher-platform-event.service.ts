import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherPlatformEventService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(input: {
    type: string;
    source: string;
    entityType?: string;
    entityId?: string;
    status?: string;
    payload?: any;
    result?: any;
  }): Promise<any> {
    const now = new Date();

    return (this.prisma as any).platformEvent.create({
      data: {
        id: randomUUID(),
        type: input.type,
        source: input.source,
        entityType:
          input.entityType ?? null,
        entityId:
          input.entityId ?? null,
        status:
          input.status ?? "new",
        payload:
          input.payload ?? null,
        result:
          input.result ?? null,
        updatedAt: now,
      },
    });
  }
}
