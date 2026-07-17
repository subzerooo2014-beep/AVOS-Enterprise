import { Injectable } from "@nestjs/common";
import { MetadataHealthReport } from "../contracts/enterprise-metadata.contracts";
import { DependencyGraphService } from "./dependency-graph.service";
import { MetadataRegistryService } from "./metadata-registry.service";

@Injectable()
export class MetadataHealthService {
  constructor(private readonly registry: MetadataRegistryService, private readonly graph: DependencyGraphService) {}
  report(): MetadataHealthReport {
    const assets = this.registry.list(); const edges = this.graph.list(); const orphans = this.graph.orphanIds(); const cycles = this.graph.cycleCount();
    const findings: string[] = [];
    if (orphans.length > 0) findings.push(`${orphans.length} orphan metadata asset(s) detected.`);
    if (cycles > 0) findings.push(`${cycles} cyclic dependency path(s) detected.`);
    const score = Math.max(0, Math.min(100, 80 + Math.min(edges.length * 4, 12) - Math.min(orphans.length * 2, 8) - Math.min(cycles * 10, 30)));
    return { status: score >= 75 && cycles === 0 ? "healthy" : score >= 50 ? "degraded" : "critical", score, assets: assets.length, activeAssets: assets.filter((a) => a.status === "active").length, edges: edges.length, orphanAssets: orphans.length, cyclicDependencies: cycles, findings, generatedAt: new Date().toISOString() };
  }
}
