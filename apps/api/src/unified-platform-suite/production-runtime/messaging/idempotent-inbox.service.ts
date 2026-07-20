import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { InboxMessage } from "../contracts/production-runtime.types";
import { ProductionPersistenceService } from "../persistence/production-persistence.service";

@Injectable()
export class IdempotentInboxService {
  constructor(private readonly persistence: ProductionPersistenceService) {}

  async receive<T>(source: string, messageId: string, payload: T) {
    const records = await this.persistence.list<InboxMessage>("inbox-message");
    const duplicate = records.find(
      (record) => record.data.source === source && record.data.messageId === messageId
    );
    if (duplicate) {
      return { duplicate: true, message: duplicate.data };
    }

    const message: InboxMessage<T> = {
      id: randomUUID(),
      source,
      messageId,
      payload,
      status: "received",
      receivedAt: new Date().toISOString()
    };
    await this.persistence.upsert("inbox-message", message.id, message);
    return { duplicate: false, message };
  }

  async markProcessed(id: string) {
    const record = await this.persistence.get<InboxMessage>("inbox-message", id);
    if (!record) return null;
    const message: InboxMessage = {
      ...record.data,
      status: "processed",
      processedAt: new Date().toISOString(),
      error: undefined
    };
    await this.persistence.upsert("inbox-message", id, message);
    return message;
  }

  async metrics() {
    const records = await this.persistence.list<InboxMessage>("inbox-message");
    const messages = records.map((record) => record.data);
    return {
      total: messages.length,
      received: messages.filter((item) => item.status === "received").length,
      processed: messages.filter((item) => item.status === "processed").length,
      failed: messages.filter((item) => item.status === "failed").length
    };
  }
}