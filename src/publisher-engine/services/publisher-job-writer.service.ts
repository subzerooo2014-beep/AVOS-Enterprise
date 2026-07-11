import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherJobWriterService {
  constructor(private readonly prisma: PrismaService) {}

  update(id: string, data: any) {
    return (this.prisma as any).publishJob.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
  }

  create(data: any) {
    return (this.prisma as any).publishJob.create({
      data: {
        title: data.title,
        content: data.content ?? null,
        campaignId: data.campaignId ?? null,
        channelId: data.channelId ?? null,
        status: data.status ?? "queued",
        priority: data.priority ?? "normal",
        scheduledAt: data.scheduledAt ?? null,
        maxRetries: data.maxRetries ?? 3,
        result: data.result ?? {},
      },
    });
  }
}
