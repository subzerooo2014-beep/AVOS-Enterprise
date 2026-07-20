import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { hostname } from "os";
import { RuntimeNode } from "../contracts/production-runtime.types";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class RuntimeNodeRegistryService implements OnModuleInit, OnModuleDestroy {
  private heartbeatTimer?: NodeJS.Timeout;
  readonly nodeId =
    process.env.AVOS_RUNTIME_NODE_ID ??
    `${hostname()}-${process.pid}`;

  constructor(private readonly persistence: ProductionPersistenceService) {}

  async onModuleInit() {
    await this.join();
    this.heartbeatTimer = setInterval(() => {
      void this.heartbeat();
    }, 15000);
    this.heartbeatTimer.unref();
  }

  async onModuleDestroy() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    await this.setStatus("offline");
  }

  async join() {
    const now = new Date().toISOString();
    const node: RuntimeNode = {
      id: this.nodeId,
      host: hostname(),
      region: process.env.AVOS_RUNTIME_REGION ?? "local",
      status: "active",
      capabilities: [
        "distributed-task-execution",
        "workflow-recovery",
        "outbox-dispatch",
        "ultra-suite-adapters"
      ],
      heartbeatAt: now,
      startedAt: now
    };
    await this.persistence.upsert("runtime-lease", this.nodeId, node);
    return node;
  }

  async heartbeat() {
    const record = await this.persistence.get<RuntimeNode>("runtime-lease", this.nodeId);
    const node: RuntimeNode = {
      ...(record?.data ?? await this.join()),
      status: "active",
      heartbeatAt: new Date().toISOString()
    };
    await this.persistence.upsert("runtime-lease", this.nodeId, node);
    return node;
  }

  async listActive(staleAfterMs = 45000) {
    const cutoff = Date.now() - staleAfterMs;
    const records = await this.persistence.list<RuntimeNode>("runtime-lease");
    return records
      .map((record) => record.data)
      .filter((node) => node.status === "active" && Date.parse(node.heartbeatAt) >= cutoff);
  }

  private async setStatus(status: RuntimeNode["status"]) {
    const record = await this.persistence.get<RuntimeNode>("runtime-lease", this.nodeId);
    if (!record) return null;
    const node = { ...record.data, status, heartbeatAt: new Date().toISOString() };
    await this.persistence.upsert("runtime-lease", this.nodeId, node);
    return node;
  }
}