import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class AgsTransactionalOutboxService {
  constructor(private readonly prisma: PrismaService) {}

  claim(workerId: string, limit = 50, leaseSeconds = 30) {
    const sql = [
      "WITH candidates AS (",
      '  SELECT id FROM "ags_outbox_messages"',
      "  WHERE status IN ('pending', 'retry')",
      '    AND "availableAt" <= NOW()',
      '    AND ("leaseExpiresAt" IS NULL OR "leaseExpiresAt" < NOW())',
      '  ORDER BY "createdAt" ASC',
      "  FOR UPDATE SKIP LOCKED",
      "  LIMIT $1",
      ")",
      'UPDATE "ags_outbox_messages" o',
      "SET status = 'processing',",
      '    "leaseOwner" = $2,',
      '    "leaseExpiresAt" = NOW() + ($3 * INTERVAL \'1 second\'),',
      "    attempts = attempts + 1,",
      '    "updatedAt" = NOW()',
      "FROM candidates c",
      "WHERE o.id = c.id",
      'RETURNING o.id, o.topic, o."eventType", o.payload, o.headers,',
      '          o.attempts, o."maxAttempts", o."leaseOwner", o."leaseExpiresAt"',
    ].join("\n");

    return (this.prisma as any).$queryRawUnsafe(
      sql,
      Math.min(Math.max(limit, 1), 200),
      workerId,
      Math.min(Math.max(leaseSeconds, 5), 300),
    );
  }

  markPublished(id: string, workerId: string) {
    return (this.prisma as any).agsOutboxMessage.updateMany({
      where: { id, leaseOwner: workerId, status: "processing" },
      data: {
        status: "published",
        publishedAt: new Date(),
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }

  async markRetry(id: string, workerId: string, error: string) {
    const item = await (this.prisma as any).agsOutboxMessage.findUnique({
      where: { id },
    });
    if (!item) return null;

    const terminal = item.attempts >= item.maxAttempts;
    return (this.prisma as any).agsOutboxMessage.updateMany({
      where: { id, leaseOwner: workerId, status: "processing" },
      data: {
        status: terminal ? "dead-letter" : "retry",
        lastError: error.slice(0, 4000),
        availableAt: new Date(Date.now() + Math.min(60000, 1000 * 2 ** item.attempts)),
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }

  status() {
    return (this.prisma as any).agsOutboxMessage.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  }
}