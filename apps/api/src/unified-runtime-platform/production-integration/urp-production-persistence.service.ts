import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UrpProductionPersistenceService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.ensureSchema();
  }

  async ensureSchema(): Promise<void> {
    await this.execute(
      [
        'CREATE TABLE IF NOT EXISTS "avos_urp_runtime_nodes" (',
        '  "node_id" TEXT PRIMARY KEY,',
        '  "runtime_version" TEXT NOT NULL,',
        '  "host" TEXT NOT NULL,',
        '  "pid" INTEGER NOT NULL,',
        '  "status" TEXT NOT NULL,',
        `  "metadata" TEXT NOT NULL DEFAULT '{}',`,
        '  "lease_expires_at" TEXT NOT NULL,',
        '  "last_heartbeat_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,',
        '  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,',
        '  "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
        ')',
      ].join("\n"),
    );

    await this.execute(
      [
        'CREATE INDEX IF NOT EXISTS "avos_urp_runtime_nodes_lease_idx"',
        'ON "avos_urp_runtime_nodes" ("lease_expires_at")',
      ].join("\n"),
    );

    await this.execute(
      [
        'CREATE TABLE IF NOT EXISTS "avos_urp_runtime_registry" (',
        '  "unit_key" TEXT NOT NULL,',
        '  "node_id" TEXT NOT NULL,',
        '  "version" TEXT NOT NULL,',
        '  "status" TEXT NOT NULL,',
        '  "health_endpoint" TEXT,',
        '  "readiness_endpoint" TEXT,',
        `  "metadata" TEXT NOT NULL DEFAULT '{}',`,
        '  "registered_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,',
        '  "updated_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,',
        '  PRIMARY KEY ("unit_key", "node_id")',
        ')',
      ].join("\n"),
    );

    await this.execute(
      [
        'CREATE TABLE IF NOT EXISTS "avos_urp_runtime_audit" (',
        '  "id" TEXT PRIMARY KEY,',
        '  "action" TEXT NOT NULL,',
        '  "actor" TEXT NOT NULL,',
        '  "unit_key" TEXT,',
        '  "correlation_id" TEXT,',
        '  "status" TEXT NOT NULL,',
        `  "details" TEXT NOT NULL DEFAULT '{}',`,
        '  "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP',
        ')',
      ].join("\n"),
    );

    await this.execute(
      [
        'CREATE INDEX IF NOT EXISTS "avos_urp_runtime_audit_corr_idx"',
        'ON "avos_urp_runtime_audit" ("correlation_id", "created_at" DESC)',
      ].join("\n"),
    );
  }

  async execute(sql: string, ...params: unknown[]): Promise<number> {
    return this.prisma.$executeRawUnsafe(sql, ...params);
  }

  async query<T = unknown>(
    sql: string,
    ...params: unknown[]
  ): Promise<T[]> {
    return this.prisma.$queryRawUnsafe<T[]>(sql, ...params);
  }
}