import { Injectable } from "@nestjs/common";
import {
  BlueprintValidationFinding,
  LivingBlueprintHealth,
} from "../contracts/living-blueprint.contracts";
import { LivingBlueprintRegistryService } from "./living-blueprint-registry.service";

@Injectable()
export class BlueprintValidationService {
  constructor(private readonly registry: LivingBlueprintRegistryService) {}

  validate(): LivingBlueprintHealth {
    const nodes = this.registry.listNodes();
    const edges = this.registry.listEdges();
    const findings: BlueprintValidationFinding[] = [];

    const orphanNodes = nodes.filter(
      (node) =>
        this.registry.incomingEdges(node.id).length === 0 &&
        this.registry.outgoingEdges(node.id).length === 0,
    );

    for (const node of orphanNodes) {
      findings.push(this.finding(
        "warning",
        "dependency",
        "Orphan blueprint node",
        `${node.name} is not connected to the living blueprint graph.`,
        "Create at least one valid incoming or outgoing blueprint relationship.",
        node.id,
      ));
    }

    for (const node of nodes) {
      if (!node.owner.trim()) {
        findings.push(this.finding(
          "error",
          "identity",
          "Missing architecture owner",
          `${node.name} has no responsible owner.`,
          "Assign an accountable architecture owner.",
          node.id,
        ));
      }

      if (Object.keys(node.runtime).length === 0) {
        findings.push(this.finding(
          "warning",
          "runtime",
          "Missing runtime state",
          `${node.name} has no synchronized runtime information.`,
          "Synchronize runtime status, health, and operational metadata.",
          node.id,
        ));
      }

      if (node.contracts.length === 0) {
        findings.push(this.finding(
          "warning",
          "contract",
          "Missing blueprint contract",
          `${node.name} has no declared contract.`,
          "Register at least one stable contract.",
          node.id,
        ));
      }

      if (node.policies.length === 0) {
        findings.push(this.finding(
          "warning",
          "policy",
          "Missing blueprint policy",
          `${node.name} has no declared governance policy.`,
          "Attach at least one governance policy.",
          node.id,
        ));
      }
    }

    const cyclicDependencies = this.countCycles();
    if (cyclicDependencies > 0) {
      findings.push(this.finding(
        "critical",
        "dependency",
        "Cyclic blueprint dependencies",
        `${cyclicDependencies} dependency cycles were detected.`,
        "Break cyclic dependencies using stable contracts or orchestration boundaries.",
      ));
    }

    const runtimeCoverage = this.coverage(nodes.filter((node) => Object.keys(node.runtime).length > 0).length, nodes.length);
    const contractCoverage = this.coverage(nodes.filter((node) => node.contracts.length > 0).length, nodes.length);
    const policyCoverage = this.coverage(nodes.filter((node) => node.policies.length > 0).length, nodes.length);

    const critical = findings.filter((finding) => finding.severity === "critical").length;
    const errors = findings.filter((finding) => finding.severity === "error").length;
    const warnings = findings.filter((finding) => finding.severity === "warning").length;

    const score = Math.max(
      0,
      Math.round(
        100 -
        critical * 30 -
        errors * 15 -
        warnings * 4 -
        (100 - runtimeCoverage) * 0.08 -
        (100 - contractCoverage) * 0.06 -
        (100 - policyCoverage) * 0.06,
      ),
    );

    return {
      id: `living-blueprint-health:${Date.now()}`,
      status: score >= 85 ? "healthy" : score >= 65 ? "degraded" : "critical",
      score,
      nodes: nodes.length,
      activeNodes: nodes.filter((node) => node.status === "active").length,
      edges: edges.length,
      orphanNodes: orphanNodes.length,
      cyclicDependencies,
      runtimeCoverage,
      contractCoverage,
      policyCoverage,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }

  private coverage(covered: number, total: number): number {
    return total === 0 ? 0 : Math.round((covered / total) * 100);
  }

  private countCycles(): number {
    const nodes = this.registry.listNodes();
    const visited = new Set<string>();
    const active = new Set<string>();
    let cycles = 0;

    const visit = (nodeId: string): void => {
      if (active.has(nodeId)) {
        cycles += 1;
        return;
      }

      if (visited.has(nodeId)) return;

      visited.add(nodeId);
      active.add(nodeId);

      for (const edge of this.registry.outgoingEdges(nodeId)) {
        if (edge.type === "depends-on") {
          visit(edge.targetId);
        }
      }

      active.delete(nodeId);
    };

    for (const node of nodes) {
      visit(node.id);
    }

    return cycles;
  }

  private finding(
    severity: BlueprintValidationFinding["severity"],
    category: BlueprintValidationFinding["category"],
    title: string,
    description: string,
    remediation: string,
    nodeId?: string,
    edgeId?: string,
  ): BlueprintValidationFinding {
    return {
      id: `living-blueprint-finding:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      severity,
      category,
      title,
      description,
      remediation,
      nodeId,
      edgeId,
      detectedAt: new Date().toISOString(),
    };
  }
}