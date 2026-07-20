import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { UrpProductionPersistenceService } from "./urp-production-persistence.service";

@Injectable()
export class UrpProductionAuditService {
  constructor(private readonly persistence: UrpProductionPersistenceService) {}

  async record(input: {
    action: string;
    actor: string;
    unitKey?: string;
    correlationId?: string;
    status: string;
    details?: unknown;
  }) {
    const id = "urp-audit:" + randomUUID();

    await this.persistence.execute(
      [
        'INSERT INTO "avos_urp_runtime_audit"',
        '("id", "action", "actor", "unit_key", "correlation_id", "status", "details")',
        'VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ].join("\n"),
      id,
      input.action,
      input.actor,
      input.unitKey ?? null,
      input.correlationId ?? null,
      input.status,
      JSON.stringify(input.details ?? {}),
    );

    return { id, ...input, createdAt: new Date().toISOString() };
  }

  async recent(limit = 100) {
    return this.persistence.query(
      [
        'SELECT "id", "action", "actor", "unit_key", "correlation_id",',
        '"status", "details", "created_at"',
        'FROM "avos_urp_runtime_audit"',
        'ORDER BY "created_at" DESC',
        'LIMIT $1',
      ].join("\n"),
      Math.min(Math.max(limit, 1), 1000),
    );
  }
}