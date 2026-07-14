import { Injectable } from '@nestjs/common';
import { MemoryNode } from './enterprise-ai-cognitive-core.types';

@Injectable()
export class LongTermEnterpriseMemoryService {
  private readonly memory = new Map<string, MemoryNode>();

  store(node: MemoryNode): MemoryNode {
    this.memory.set(node.id, { ...node });
    return { ...node };
  }

  recall(minimumImportance = 0): MemoryNode[] {
    return [...this.memory.values()]
      .filter((node) => node.importance >= minimumImportance)
      .sort((left, right) => right.importance - left.importance)
      .map((node) => ({ ...node }));
  }

  health() {
    const nodes = [...this.memory.values()];
    return {
      entries: nodes.length,
      averageImportance: Math.round(
        nodes.reduce((sum, node) => sum + node.importance, 0) /
          Math.max(1, nodes.length),
      ),
      staleEntries: nodes.filter(
        (node) =>
          Date.now() - new Date(node.lastAccessedAt).getTime() >
          30 * 24 * 60 * 60 * 1000,
      ).length,
    };
  }
}