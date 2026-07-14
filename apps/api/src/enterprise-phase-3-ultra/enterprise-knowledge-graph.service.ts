import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeNode } from "./enterprise-phase-3-ultra.types";

@Injectable()
export class EnterpriseKnowledgeGraphService {
  private readonly nodes = new Map<string, KnowledgeNode>();

  register(type: string, key: string, value: string, confidence = 90): KnowledgeNode {
    const node: KnowledgeNode = {
      id: randomUUID(),
      type,
      key,
      value,
      confidence: Math.min(100, Math.max(0, Math.round(confidence))),
      createdAt: new Date().toISOString(),
    };

    this.nodes.set(`${type}:${key}`, node);
    return node;
  }

  get(type: string, key: string): KnowledgeNode | null {
    return this.nodes.get(`${type}:${key}`) || null;
  }

  count(): number {
    return this.nodes.size;
  }
}