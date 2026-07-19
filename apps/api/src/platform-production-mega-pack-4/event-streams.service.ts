import { Injectable } from "@nestjs/common";
import {
  EventEnvelope,
  EventStreamRecord,
} from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class EventStreamsService {
  constructor(
    private readonly store: EventMeshFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  append(streamKey: string, envelope: EventEnvelope): EventStreamRecord {
    const records = this.read(streamKey);
    const record: EventStreamRecord = {
      id: this.id("event-stream"),
      streamKey,
      sequence: records.length + 1,
      envelope,
      persistedAt: this.now(),
    };

    this.store.writeJson(
      `streams/${streamKey}/${record.id}.json`,
      record,
    );

    return record;
  }

  read(streamKey: string): EventStreamRecord[] {
    return this.store
      .listJson<EventStreamRecord>(`streams/${streamKey}`)
      .sort((a, b) => a.sequence - b.sequence);
  }

  streamKeys(): string[] {
    const records = this.store.listJson<EventStreamRecord>("streams-flat");
    return Array.from(new Set(records.map((record) => record.streamKey)));
  }
}