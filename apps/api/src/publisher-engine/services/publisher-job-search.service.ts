import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PublisherJobSearchService {
  constructor(private readonly prisma: PrismaService) {}

  search(keyword: string, limit = 100) {
    return (this.prisma as any).publishJob.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
