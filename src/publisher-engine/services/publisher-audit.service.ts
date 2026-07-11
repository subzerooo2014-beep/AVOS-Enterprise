import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherAuditService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async write(action: string, job: any, payload?: any) {
    return (this.prisma as any).aiActionLog.create({
      data: {
        id: crypto.randomUUID(),
        entityType: "publish_job",
        entityId: job.id,
        action,
        status: "completed",
        createdAt: new Date(),
      },
    });
  }
}
