import { Injectable, NotFoundException } from "@nestjs/common";
import { ArchitectureObservatoryRecord, ArchitectureObservatoryStatus } from "./observatory.types";

const createArchitectureId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class ArchitectureObservatoryService {
  private readonly records = new Map<string, ArchitectureObservatoryRecord>();
  private readonly capabilities = "runtime observation, architecture signals, drift monitoring, health snapshots".split(", ");

  create(
    input: Pick<ArchitectureObservatoryRecord, "name" | "description"> &
      Partial<Pick<ArchitectureObservatoryRecord, "score" | "architecture" | "findings">>,
  ): ArchitectureObservatoryRecord {
    const now = new Date().toISOString();
    const record: ArchitectureObservatoryRecord = {
      id: createArchitectureId(),
      name: input.name,
      description: input.description,
      score: Math.max(0, Math.min(100, input.score ?? 100)),
      state: "DRAFT",
      architecture: input.architecture ?? {},
      findings: input.findings ?? [],
      createdAt: now,
      updatedAt: now,
    };
    this.records.set(record.id, record);
    return structuredClone(record);
  }

  activate(id: string): ArchitectureObservatoryRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): ArchitectureObservatoryRecord {
    const record = this.require(id);
    record.state = "ARCHIVED";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  assess(id: string): {
    id: string;
    score: number;
    level: "excellent" | "good" | "attention";
    findings: string[];
  } {
    const record = this.require(id);
    const level = record.score >= 90 ? "excellent" : record.score >= 70 ? "good" : "attention";
    return { id: record.id, score: record.score, level, findings: [...record.findings] };
  }

  list(): ArchitectureObservatoryRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): ArchitectureObservatoryRecord {
    return structuredClone(this.require(id));
  }

  status(): ArchitectureObservatoryStatus {
    return {
      system: "AVOS Architecture Intelligence Engine",
      layer: "A rc hi te ct ur eO bs er va to ry",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): ArchitectureObservatoryRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`A rc hi te ct ur eO bs er va to ry record ${id} was not found`);
    }
    return record;
  }
}