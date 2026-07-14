import { Injectable } from '@nestjs/common';
import {
  MemoryEdge,
  MemoryNode,
} from './enterprise-ai-cognitive-core.types';

@Injectable()
export class EnterpriseMemoryGraphV2Service {
  build(nodes: MemoryNode[], edges: MemoryEdge[]) {
    const nodeIds = new Set(nodes.map((node) => node.id));
    const validEdges = edges.filter(
      (edge) => nodeIds.has(edge.from) && nodeIds.has(edge.to),
    );

    const degree = new Map<string, number>();
    for (const edge of validEdges) {
      degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
      degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
    }

    return {
      nodes,
      edges: validEdges,
      orphanNodes: nodes
        .filter((node) => !degree.has(node.id))
        .map((node) => node.id),
      centralNodes: [...degree.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 5)
        .map(([nodeId]) => nodeId),
      graphHealth: Math.round(
        (validEdges.length / Math.max(1, edges.length)) * 100,
      ),
    };
  }
}