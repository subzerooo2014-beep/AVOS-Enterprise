import { Injectable, NotFoundException } from "@nestjs/common";
import type { FlowStandard } from "./core-flow-standards.types";

@Injectable()
export class CoreFlowStandardsRegistryService {
  private readonly standards = new Map<string, FlowStandard>();

  register(dto: any) {
    const standard: FlowStandard = {
      id: `standard_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      code: String(dto?.code ?? "AVOS-STD-001"),
      name: String(dto?.name ?? "AVOS Core Flow Standard"),
      version: String(dto?.version ?? "1.0.0"),
      jurisdiction: String(dto?.jurisdiction ?? "global"),
      requirements: Array.isArray(dto?.requirements)
        ? dto.requirements.map(String)
        : [],
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    this.standards.set(standard.id, standard);
    return standard;
  }

  findAll(query: any = {}) {
    return Array.from(this.standards.values())
      .filter((item) => !query.status || item.status === query.status)
      .filter(
        (item) =>
          !query.jurisdiction || item.jurisdiction === query.jurisdiction,
      )
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const standard = this.standards.get(id);
    if (!standard) throw new NotFoundException("Flow standard not found");
    return standard;
  }

  activate(id: string) {
    const standard = this.findOne(id);
    standard.status = "active";
    return standard;
  }

  deprecate(id: string) {
    const standard = this.findOne(id);
    standard.status = "deprecated";
    return standard;
  }

  retire(id: string) {
    const standard = this.findOne(id);
    standard.status = "retired";
    return standard;
  }
}
