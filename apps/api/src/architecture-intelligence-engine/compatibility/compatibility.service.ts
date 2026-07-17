import { Injectable, NotFoundException } from "@nestjs/common";
import { ArchitectureCompatibilityRecord, ArchitectureCompatibilityStatus } from "./compatibility.types";

const createArchitectureId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class ArchitectureCompatibilityService {
  private readonly records = new Map<string, ArchitectureCompatibilityRecord>();
  private readonly capabilities = "contract compatibility, version compatibility, migration readiness, breaking-change detection".split(", ");

  create(
    input: Pick<ArchitectureCompatibilityRecord, "name" | "description"> &
      Partial<Pick<ArchitectureCompatibilityRecord, "score" | "architecture" | "findings">>,
  ): ArchitectureCompatibilityRecord {
    const now = new Date().toISOString();
    const record: ArchitectureCompatibilityRecord = {
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

  activate(id: string): ArchitectureCompatibilityRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): ArchitectureCompatibilityRecord {
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

  list(): ArchitectureCompatibilityRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): ArchitectureCompatibilityRecord {
    return structuredClone(this.require(id));
  }

  status(): ArchitectureCompatibilityStatus {
    return {
      system: "AVOS Architecture Intelligence Engine",
      layer: "A rc hi te ct ur eC om pa ti bi li ty",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): ArchitectureCompatibilityRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`A rc hi te ct ur eC om pa ti bi li ty record ${id} was not found`);
    }
    return record;
  }
}