import { Injectable, NotFoundException } from "@nestjs/common";
import { ArchitectureGovernanceRecord, ArchitectureGovernanceStatus } from "./governance.types";

const createArchitectureId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

@Injectable()
export class ArchitectureGovernanceService {
  private readonly records = new Map<string, ArchitectureGovernanceRecord>();
  private readonly capabilities = "architecture policies, approval gates, exception management, decision traceability".split(", ");

  create(
    input: Pick<ArchitectureGovernanceRecord, "name" | "description"> &
      Partial<Pick<ArchitectureGovernanceRecord, "score" | "architecture" | "findings">>,
  ): ArchitectureGovernanceRecord {
    const now = new Date().toISOString();
    const record: ArchitectureGovernanceRecord = {
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

  activate(id: string): ArchitectureGovernanceRecord {
    const record = this.require(id);
    record.state = "ACTIVE";
    record.updatedAt = new Date().toISOString();
    return structuredClone(record);
  }

  archive(id: string): ArchitectureGovernanceRecord {
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

  list(): ArchitectureGovernanceRecord[] {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  get(id: string): ArchitectureGovernanceRecord {
    return structuredClone(this.require(id));
  }

  status(): ArchitectureGovernanceStatus {
    return {
      system: "AVOS Architecture Intelligence Engine",
      layer: "A rc hi te ct ur eG ov er na nc e",
      status: "operational",
      capabilities: [...this.capabilities],
      records: this.records.size,
    };
  }

  private require(id: string): ArchitectureGovernanceRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new NotFoundException(`A rc hi te ct ur eG ov er na nc e record ${id} was not found`);
    }
    return record;
  }
}