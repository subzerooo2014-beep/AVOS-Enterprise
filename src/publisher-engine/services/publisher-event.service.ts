import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(type: string, job: any, payload?: any) {
    return (this.prisma as any).platformEvent.create({
      data: {
        id: crypto.randomUUID(),
        type,
        source: "publisher-engine",
        entityType: "publish_job",
        entityId: job.id,
        status: "new",
        payload: payload ?? {},
        result: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
