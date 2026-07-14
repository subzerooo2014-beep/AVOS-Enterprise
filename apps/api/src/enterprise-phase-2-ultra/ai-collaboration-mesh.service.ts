import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

@Injectable()
export class AiCollaborationMeshService {
  private readonly nodes: Array<{ id: string; name: string; role: string; trust: number }> = [];

  register(name: string, role: string, trust = 90) {
    const node = { id: randomUUID(), name, role, trust };
    this.nodes.push(node);
    return node;
  }

  coordinate(task: string) {
    const trustScore = this.nodes.length === 0
      ? 0
      : Math.round(this.nodes.reduce((sum, node) => sum + node.trust, 0) / this.nodes.length);

    return {
      task,
      participants: this.nodes.map((node) => node.name),
      coordinated: this.nodes.length >= 2,
      trustScore,
      completedAt: new Date().toISOString(),
    };
  }

  count(): number {
    return this.nodes.length;
  }
}