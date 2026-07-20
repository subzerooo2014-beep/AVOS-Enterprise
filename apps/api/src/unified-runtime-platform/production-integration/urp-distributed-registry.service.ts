import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { hostname } from "os";
import { randomUUID } from "crypto";
import { UrpAdapterCatalogService } from "./urp-adapter-catalog.service";
import { UrpEndpointDiscoveryService } from "./urp-endpoint-discovery.service";
import { UrpProductionPersistenceService } from "./urp-production-persistence.service";

@Injectable()
export class UrpDistributedRegistryService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly nodeId =
    process.env.AVOS_URP_NODE_ID ??
    hostname() + ":" + process.pid + ":" + randomUUID();
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly persistence: UrpProductionPersistenceService,
    private readonly catalog: UrpAdapterCatalogService,
    private readonly discovery: UrpEndpointDiscoveryService,
  ) {}

  async onApplicationBootstrap() {
    await this.heartbeat();
    this.timer = setInterval(
      () => void this.heartbeat(),
      Number(process.env.AVOS_URP_HEARTBEAT_MS ?? 10000),
    );
    this.timer.unref();
  }

  async onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
    await this.persistence.execute(
      'UPDATE "avos_urp_runtime_nodes" SET "status" = $2, "lease_expires_at" = CURRENT_TIMESTAMP, "updated_at" = CURRENT_TIMESTAMP WHERE "node_id" = $1',
      this.nodeId,
      "stopped",
    );
  }

  async heartbeat() {
    const leaseSeconds = Number(process.env.AVOS_URP_NODE_LEASE_SECONDS ?? 30);

    await this.persistence.execute(
      [
        'INSERT INTO "avos_urp_runtime_nodes"',
        '("node_id", "runtime_version", "host", "pid", "status", "metadata", "lease_expires_at", "last_heartbeat_at", "updated_at")',
        "VALUES ($1, $2, $3, $4, $5, $6, datetime('now', '+' || $7 || ' seconds'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
        'ON CONFLICT ("node_id") DO UPDATE SET',
        '"runtime_version" = EXCLUDED."runtime_version",',
        '"status" = EXCLUDED."status",',
        '"metadata" = EXCLUDED."metadata",',
        '"lease_expires_at" = EXCLUDED."lease_expires_at",',
        '"last_heartbeat_at" = CURRENT_TIMESTAMP,',
        '"updated_at" = CURRENT_TIMESTAMP',
      ].join("\n"),
      this.nodeId,
      "URP-1.1.0",
      hostname(),
      process.pid,
      "operational",
      JSON.stringify({
        foundationFirst: true,
        humanFinalAuthority: true,
      }),
      String(leaseSeconds),
    );

    for (const adapter of this.catalog.list()) {
      const health = this.discovery.getCached(adapter.key, "health");
      const readiness = this.discovery.getCached(adapter.key, "readiness");

      await this.persistence.execute(
        [
          'INSERT INTO "avos_urp_runtime_registry"',
          '("unit_key", "node_id", "version", "status", "health_endpoint", "readiness_endpoint", "metadata", "updated_at")',
          'VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)',
          'ON CONFLICT ("unit_key", "node_id") DO UPDATE SET',
          '"version" = EXCLUDED."version",',
          '"status" = EXCLUDED."status",',
          '"health_endpoint" = EXCLUDED."health_endpoint",',
          '"readiness_endpoint" = EXCLUDED."readiness_endpoint",',
          '"metadata" = EXCLUDED."metadata",',
          '"updated_at" = CURRENT_TIMESTAMP',
        ].join("\n"),
        adapter.key,
        this.nodeId,
        adapter.version,
        health?.status === "available" ? "operational" : "unknown",
        health?.url ?? null,
        readiness?.url ?? null,
        JSON.stringify(adapter.metadata),
      );
    }

    return this.status();
  }

  async status() {
    const nodes = await this.persistence.query(
      [
        'SELECT "node_id", "runtime_version", "host", "pid", "status",',
        '"lease_expires_at", "last_heartbeat_at", "metadata"',
        'FROM "avos_urp_runtime_nodes"',
        'ORDER BY "last_heartbeat_at" DESC',
      ].join("\n"),
    );

    const registry = await this.persistence.query(
      [
        'SELECT "unit_key", "node_id", "version", "status",',
        '"health_endpoint", "readiness_endpoint", "metadata", "updated_at"',
        'FROM "avos_urp_runtime_registry"',
        'ORDER BY "unit_key", "node_id"',
      ].join("\n"),
    );

    return {
      nodeId: this.nodeId,
      nodes,
      registry,
      checkedAt: new Date().toISOString(),
    };
  }
}