import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class AgsIdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  get(key: string) {
    return (this.prisma as any).agsIdempotencyRecord.findFirst({
      where: { key, expiresAt: { gt: new Date() } },
    });
  }

  save(key: string, scope: string, response: unknown, ttlSeconds = 86400) {
    return (this.prisma as any).agsIdempotencyRecord.upsert({
      where: { key },
      update: {
        response,
        scope,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
      create: {
        key,
        scope,
        response,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000),
      },
    });
  }

  cleanup() {
    return (this.prisma as any).agsIdempotencyRecord.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }
}