import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryDeadLetterRecord,
  AvosFactoryJob
} from "./avos-factory-operations.contracts";

@Injectable()
export class AvosFactoryDeadLetterService {
  private readonly records: AvosFactoryDeadLetterRecord[] = [];

  add(
    job: AvosFactoryJob,
    error: string
  ): AvosFactoryDeadLetterRecord {
    const record: AvosFactoryDeadLetterRecord = {
      id: randomUUID(),
      jobId: job.id,
      jobType: job.type,
      subjectId: job.subjectId,
      actor: job.actor,
      attempts: job.attempts,
      error,
      payload: structuredClone(job.payload),
      createdAt: new Date().toISOString()
    };

    this.records.unshift(record);
    return structuredClone(record);
  }

  list(limit = 100): AvosFactoryDeadLetterRecord[] {
    return this.records
      .slice(0, Math.max(1, Math.min(limit, 1000)))
      .map((record) => structuredClone(record));
  }

  count(): number {
    return this.records.length;
  }
}
