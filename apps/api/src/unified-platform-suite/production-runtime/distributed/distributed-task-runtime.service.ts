import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { DistributedTask } from "../contracts/production-runtime.types";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";
import { RuntimeNodeRegistryService } from "./runtime-node-registry.service";
import { UltraSuiteAdapterRegistryService } from "../adapters/ultra-suite-adapter-registry.service";

@Injectable()
export class DistributedTaskRuntimeService {
  constructor(
    private readonly persistence: ProductionPersistenceService,
    private readonly nodes: RuntimeNodeRegistryService,
    private readonly adapters: UltraSuiteAdapterRegistryService
  ) {}

  async enqueue<T>(type: string, payload: T, maxAttempts = 3) {
    const now = new Date().toISOString();
    const task: DistributedTask<T> = {
      id: randomUUID(),
      type,
      payload,
      status: "queued",
      attempts: 0,
      maxAttempts,
      createdAt: now,
      updatedAt: now
    };
    await this.persistence.upsert("distributed-task", task.id, task);
    return task;
  }

  async leaseNext(leaseMs = 30000) {
    const records = await this.persistence.list<DistributedTask>("distributed-task");
    const now = Date.now();
    const candidate = records
      .map((record) => record.data)
      .find((task) =>
        task.status === "queued" ||
        (task.status === "leased" && task.leaseExpiresAt && Date.parse(task.leaseExpiresAt) < now)
      );
    if (!candidate) return null;

    const leased: DistributedTask = {
      ...candidate,
      status: "leased",
      assignedNodeId: this.nodes.nodeId,
      leaseExpiresAt: new Date(now + leaseMs).toISOString(),
      updatedAt: new Date().toISOString()
    };
    await this.persistence.upsert("distributed-task", leased.id, leased);
    return leased;
  }

  async executeNext() {
    const task = await this.leaseNext();
    if (!task) return { status: "idle" };

    const running: DistributedTask = {
      ...task,
      status: "running",
      attempts: task.attempts + 1,
      updatedAt: new Date().toISOString()
    };
    await this.persistence.upsert("distributed-task", running.id, running);

    try {
      const payload = running.payload as {
        suiteId?: string;
        action?: string;
        input?: Record<string, unknown>;
      };
      const result = payload.suiteId && payload.action
        ? await this.adapters.execute(payload.suiteId, payload.action, payload.input ?? {})
        : { accepted: true, type: running.type, payload: running.payload };

      const completed: DistributedTask = {
        ...running,
        status: "completed",
        result,
        leaseExpiresAt: undefined,
        updatedAt: new Date().toISOString()
      };
      await this.persistence.upsert("distributed-task", completed.id, completed);
      return completed;
    } catch (error) {
      const terminal = running.attempts >= running.maxAttempts;
      const failed: DistributedTask = {
        ...running,
        status: terminal ? "dead-lettered" : "queued",
        error: error instanceof Error ? error.message : String(error),
        leaseExpiresAt: undefined,
        updatedAt: new Date().toISOString()
      };
      await this.persistence.upsert("distributed-task", failed.id, failed);
      return failed;
    }
  }

  async recoverExpiredLeases() {
    const records = await this.persistence.list<DistributedTask>("distributed-task");
    const now = Date.now();
    let recovered = 0;
    for (const record of records) {
      const task = record.data;
      if (
        (task.status === "leased" || task.status === "running") &&
        task.leaseExpiresAt &&
        Date.parse(task.leaseExpiresAt) < now
      ) {
        await this.persistence.upsert("distributed-task", task.id, {
          ...task,
          status: "queued",
          assignedNodeId: undefined,
          leaseExpiresAt: undefined,
          updatedAt: new Date().toISOString()
        });
        recovered += 1;
      }
    }
    return { recovered, recoveredAt: new Date().toISOString() };
  }

  async metrics() {
    const records = await this.persistence.list<DistributedTask>("distributed-task");
    const tasks = records.map((record) => record.data);
    return {
      total: tasks.length,
      queued: tasks.filter((item) => item.status === "queued").length,
      running: tasks.filter((item) => item.status === "running" || item.status === "leased").length,
      completed: tasks.filter((item) => item.status === "completed").length,
      failed: tasks.filter((item) => item.status === "failed").length,
      deadLettered: tasks.filter((item) => item.status === "dead-lettered").length
    };
  }
}