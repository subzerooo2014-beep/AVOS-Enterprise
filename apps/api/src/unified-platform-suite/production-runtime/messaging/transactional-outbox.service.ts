import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { OutboxMessage } from "../contracts/production-runtime.types";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class TransactionalOutboxService {
  constructor(private readonly persistence: ProductionPersistenceService) {}

  async enqueue<T>(topic: string, key: string, payload: T) {
    const now = new Date().toISOString();
    const message: OutboxMessage<T> = {
      id: randomUUID(),
      topic,
      key,
      payload,
      status: "pending",
      attempts: 0,
      nextAttemptAt: now,
      createdAt: now
    };
    await this.persistence.upsert("outbox-message", message.id, message);
    return message;
  }

  async pending(limit = 100) {
    const now = Date.now();
    const records = await this.persistence.list<OutboxMessage>("outbox-message");
    return records
      .map((record) => record.data)
      .filter((message) => message.status === "pending" && Date.parse(message.nextAttemptAt) <= now)
      .slice(0, limit);
  }

  async markPublished(id: string) {
    const record = await this.persistence.get<OutboxMessage>("outbox-message", id);
    if (!record) return null;
    const message: OutboxMessage = {
      ...record.data,
      status: "published",
      attempts: record.data.attempts + 1,
      publishedAt: new Date().toISOString(),
      error: undefined
    };
    await this.persistence.upsert("outbox-message", id, message);
    return message;
  }

  async markFailed(id: string, error: string) {
    const record = await this.persistence.get<OutboxMessage>("outbox-message", id);
    if (!record) return null;
    const attempts = record.data.attempts + 1;
    const delayMs = Math.min(300000, Math.pow(2, attempts) * 1000);
    const message: OutboxMessage = {
      ...record.data,
      status: "pending",
      attempts,
      nextAttemptAt: new Date(Date.now() + delayMs).toISOString(),
      error
    };
    await this.persistence.upsert("outbox-message", id, message);
    return message;
  }

  async metrics() {
    const records = await this.persistence.list<OutboxMessage>("outbox-message");
    const messages = records.map((record) => record.data);
    return {
      total: messages.length,
      pending: messages.filter((item) => item.status === "pending").length,
      published: messages.filter((item) => item.status === "published").length,
      failedAttempts: messages.reduce((sum, item) => sum + item.attempts, 0)
    };
  }
}