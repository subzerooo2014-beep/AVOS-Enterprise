import { Injectable, NotFoundException } from "@nestjs/common";
import { ArchitectureRiskRecord, ArchitectureRiskStatus } from "./risk.types";

const createArchitectureId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class ArchitectureRiskService {
  private readonly records = new Map<string, ArchitectureRiskRecord>();
  private readonly capabilities = "risk discovery, blast-radius scoring, structural weakness detection, mitigation planning".split(", ");

  create(
    input: Pick<ArchitectureRiskRecord, "name" | "description"> &
      Partial<Pick<ArchitectureRiskRecord, "score" | "architecture" | "findings">>,
  ): ArchitectureRiskRecord {
    const now = new Date().toISOString();
    const record: ArchitectureRiskRecord = {
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

  activate(id: string): ArchitectureRiskRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): ArchitectureRiskRecord {
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

  list(): ArchitectureRiskRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): ArchitectureRiskRecord {
    return structuredClone(this.require(id));
  }

  status(): ArchitectureRiskStatus {
    return {
      system: "AVOS Architecture Intelligence Engine",
      layer: "A rc hi te ct ur eR is k",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): ArchitectureRiskRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`A rc hi te ct ur eR is k record ${id} was not found`);
    }
    return record;
  }
}