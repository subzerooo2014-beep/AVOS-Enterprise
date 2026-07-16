import { Injectable } from "@nestjs/common";
import {
  CapabilityExecutionPlan,
  CapabilityExecutionPlanNode,
  CapabilityOrchestrationDefinition,
} from "./capability-orchestration.types";

@Injectable()
export class CapabilityCompositionGraphService {
  validate(definition: CapabilityOrchestrationDefinition) {
    const issues: string[] = [];
    const nodeIds = new Set(definition.nodes.map((node) => node.id));

    if (nodeIds.size !== definition.nodes.length) {
      issues.push("DUPLICATE_NODE_ID");
    }

    for (const node of definition.nodes) {
      for (const dependency of node.dependsOn) {
        if (!nodeIds.has(dependency)) {
          issues.push(`MISSING_DEPENDENCY:${node.id}:${dependency}`);
        }
      }

      for (const fallback of node.fallbackNodeIds ?? []) {
        if (!nodeIds.has(fallback)) {
          issues.push(`MISSING_FALLBACK:${node.id}:${fallback}`);
        }
      }

      if (node.compensationNodeId && !nodeIds.has(node.compensationNodeId)) {
        issues.push(
          `MISSING_COMPENSATION:${node.id}:${node.compensationNodeId}`,
        );
      }
    }

    const cycles = this.detectCycles(definition);
    if (cycles.length > 0) {
      issues.push("COMPOSITION_CYCLE_DETECTED");
    }

    return {
      valid: issues.length === 0,
      issues,
      cycles,
      evaluatedAt: new Date().toISOString(),
    };
  }

  plan(definition: CapabilityOrchestrationDefinition): CapabilityExecutionPlan {
    const validation = this.validate(definition);
    if (!validation.valid) {
      throw new Error(
        `Invalid orchestration definition: ${validation.issues.join(", ")}`,
      );
    }

    const nodeMap = new Map(
      definition.nodes.map((node) => [node.id, node]),
    );
    const stages = new Map<number, CapabilityExecutionPlanNode[]>();

    const stageOf = (nodeId: string, visiting = new Set<string>()): number => {
      if (visiting.has(nodeId)) {
        throw new Error(`Cycle detected while planning node ${nodeId}`);
      }

      const node = nodeMap.get(nodeId);
      if (!node) return 0;
      if (node.dependsOn.length === 0) return 0;

      visiting.add(nodeId);
      const stage =
        1 +
        Math.max(
          ...node.dependsOn.map((dependency) =>
            stageOf(dependency, new Set(visiting)),
          ),
        );
      visiting.delete(nodeId);

      return stage;
    };

    for (const node of definition.nodes) {
      const stage = stageOf(node.id);
      const planned: CapabilityExecutionPlanNode = {
        nodeId: node.id,
        capabilityKey: node.capabilityKey,
        operation: node.operation,
        stage,
        mode: node.mode,
        dependencies: [...node.dependsOn],
        optional: node.optional ?? false,
      };

      const bucket = stages.get(stage) ?? [];
      bucket.push(planned);
      stages.set(stage, bucket);
    }

    return {
      orchestrationId: definition.id,
      orchestrationKey: definition.key,
      version: definition.version,
      stages: [...stages.entries()]
        .sort(([left], [right]) => left - right)
        .map(([, nodes]) => nodes),
      totalNodes: definition.nodes.length,
      parallelizableNodes: [...stages.values()]
        .filter((nodes) => nodes.length > 1)
        .reduce((total, nodes) => total + nodes.length, 0),
      fallbackNodes: definition.nodes.filter(
        (node) => (node.fallbackNodeIds?.length ?? 0) > 0,
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private detectCycles(
    definition: CapabilityOrchestrationDefinition,
  ): string[][] {
    const adjacency = new Map(
      definition.nodes.map((node) => [node.id, node.dependsOn]),
    );
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const path: string[] = [];
    const cycles: string[][] = [];

    const visit = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        const start = path.indexOf(nodeId);
        cycles.push([...path.slice(start), nodeId]);
        return;
      }

      if (visited.has(nodeId)) return;

      visiting.add(nodeId);
      path.push(nodeId);

      for (const dependency of adjacency.get(nodeId) ?? []) {
        visit(dependency);
      }

      path.pop();
      visiting.delete(nodeId);
      visited.add(nodeId);
    };

    for (const node of definition.nodes) {
      visit(node.id);
    }

    return cycles;
  }
}