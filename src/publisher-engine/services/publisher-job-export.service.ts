import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherJobExportService {
  constructor(private readonly prisma: PrismaService) {}

  async export(limit = 1000) {
    const jobs = await (this.prisma as any).publishJob.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      exported: jobs.length,
      jobs,
      generatedAt: new Date(),
    };
  }
}
