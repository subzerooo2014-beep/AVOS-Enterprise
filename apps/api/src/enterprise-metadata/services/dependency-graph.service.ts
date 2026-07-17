import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DependencyEdge, ImpactAnalysisReport } from "../contracts/enterprise-metadata.contracts";
import { LinkDependencyDto } from "../dto/enterprise-metadata.dto";
import { MetadataRegistryService } from "./metadata-registry.service";

@Injectable()
export class DependencyGraphService {
  private readonly edges: DependencyEdge[] = [];

  constructor(private readonly registry: MetadataRegistryService) {}

  link(input: LinkDependencyDto): DependencyEdge {
    if (input.sourceId === input.targetId) throw new BadRequestException("Self dependencies are not allowed");
    this.registry.get(input.sourceId); this.registry.get(input.targetId);
    const existing = this.edges.find((e) => e.sourceId === input.sourceId && e.targetId === input.targetId && e.type === input.type);
    if (existing) return existing;
    const edge: DependencyEdge = {
      id: `dependency:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      sourceId: input.sourceId,
      targetId: input.targetId,
      type: input.type,
      criticality: input.criticality ?? "medium",
      metadata: { ...(input.metadata ?? {}) },
      createdAt: new Date().toISOString(),
    };
    this.edges.push(edge); return edge;
  }

  list(): readonly DependencyEdge[] { return [...this.edges]; }
  graph() { return { nodes: this.registry.list(), edges: this.list(), generatedAt: new Date().toISOString() }; }

  lineage(assetId: string) {
    this.registry.get(assetId);
    return {
      assetId,
      upstream: this.walk(assetId, false),
      downstream: this.walk(assetId, true),
      generatedAt: new Date().toISOString(),
    };
  }

  impact(assetId: string): ImpactAnalysisReport {
    this.registry.get(assetId);
    const direct = this.edges.filter((e) => e.targetId === assetId).map((e) => e.sourceId);
    const transitive = this.walk(assetId, true).filter((id) => !direct.includes(id));
    const criticalEdges = this.edges.filter((e) => e.targetId === assetId && ["high", "critical"].includes(e.criticality)).length;
    const riskLevel: ImpactAnalysisReport["riskLevel"] = criticalEdges > 1 || transitive.length > 5 ? "critical" : criticalEdges > 0 || transitive.length > 2 ? "high" : direct.length > 0 ? "medium" : "low";
    return {
      id: `impact:${Date.now()}`,
      assetId,
      directDependents: direct,
      transitiveDependents: transitive,
      riskLevel,
      recommendations: riskLevel === "low" ? ["Proceed with standard validation."] : ["Require architecture review.", "Validate rollback and compatibility before change."],
      generatedAt: new Date().toISOString(),
    };
  }

  orphanIds(): readonly string[] {
    const connected = new Set(this.edges.flatMap((e) => [e.sourceId, e.targetId]));
    return this.registry.list().filter((item) => !connected.has(item.id)).map((item) => item.id);
  }

  cycleCount(): number {
    const nodes = this.registry.list().map((r) => r.id); let cycles = 0;
    for (const node of nodes) if (this.walk(node, true).includes(node)) cycles++;
    return cycles;
  }

  private walk(startId: string, downstream: boolean): string[] {
    const visited = new Set<string>(); const queue = [startId];
    while (queue.length) {
      const current = queue.shift(); if (!current) continue;
      const next = this.edges.filter((e) => downstream ? e.targetId === current : e.sourceId === current).map((e) => downstream ? e.sourceId : e.targetId);
      for (const id of next) if (!visited.has(id)) { visited.add(id); queue.push(id); }
    }
    return [...visited];
  }
}
