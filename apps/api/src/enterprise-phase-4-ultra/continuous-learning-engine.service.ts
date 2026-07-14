import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { LearningRecord } from "./enterprise-phase-4-ultra.types";

@Injectable()
export class ContinuousLearningEngineService {
  private readonly records: LearningRecord[] = [];

  learn(signal: string, lesson: string, confidence = 90): LearningRecord {
    const record: LearningRecord = {
      id: randomUUID(),
      signal,
      lesson,
      confidence,
      createdAt: new Date().toISOString(),
    };

    this.records.push(record);
    return record;
  }

  count(): number {
    return this.records.length;
  }
}