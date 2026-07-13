import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CoreFlowDurableStoreService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureSchema();
  }

  async ensureSchema() {
    await (this.prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_execution" (
        "id" TEXT PRIMARY KEY,
        "flow" TEXT NOT NULL,
        "correlation_id" TEXT NOT NULL,
        "payload_json" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "attempts" INTEGER NOT NULL DEFAULT 0,
        "max_attempts" INTEGER NOT NULL DEFAULT 5,
        "next_attempt_at" TIMESTAMP NULL,
        "locked_by" TEXT NULL,
        "locked_until" TIMESTAMP NULL,
        "last_error" TEXT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (this.prisma as any).$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "avos_core_flow_execution_correlation_uq"
      ON "avos_core_flow_execution" ("correlation_id")
    `);

    await (this.prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_checkpoint" (
        "id" TEXT PRIMARY KEY,
        "execution_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "state_json" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (this.prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_schedule" (
        "id" TEXT PRIMARY KEY,
        "execution_id" TEXT NOT NULL,
        "execute_at" TIMESTAMP NOT NULL,
        "status" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await (this.prisma as any).$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "avos_core_flow_idempotency" (
        "key" TEXT PRIMARY KEY,
        "response_json" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async query<T = unknown>(sql: string, ...params: unknown[]): Promise<T[]> {
    return (this.prisma as any).$queryRawUnsafe(sql, ...params);
  }

  async execute(sql: string, ...params: unknown[]): Promise<number> {
    return (this.prisma as any).$executeRawUnsafe(sql, ...params);
  }

  async transaction<T>(work: (tx: any) => Promise<T>): Promise<T> {
    return (this.prisma as any).$transaction(async (tx: any) => work(tx));
  }
}
