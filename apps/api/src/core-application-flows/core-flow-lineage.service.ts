import { Injectable } from "@nestjs/common";
import type { FlowDataLineage } from "./core-flow-enterprise.types";

@Injectable()
export class CoreFlowLineageService {
  private readonly entries: FlowDataLineage[] = [];

  record(
    executionId: string,
    source: string,
    target: string,
    transformation: string,
  ) {
    const entry: FlowDataLineage = {
      id: `lineage_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      source,
      target,
      transformation,
      createdAt: new Date().toISOString(),
    };

    this.entries.push(entry);
    return entry;
  }

  findAll(executionId?: string) {
    return this.entries
      .filter((item) => !executionId || item.executionId === executionId)
      .slice()
      .reverse();
  }

  graph(executionId: string) {
    const entries = this.findAll(executionId);
    return {
      executionId,
      nodes: Array.from(
        new Set(entries.flatMap((item) => [item.source, item.target])),
      ),
      edges: entries.map((item) => ({
        from: item.source,
        to: item.target,
        transformation: item.transformation,
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}
