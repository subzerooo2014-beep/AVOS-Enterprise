import { Injectable, NotFoundException } from "@nestjs/common";
import type { FederationNode } from "./core-flow-federation.types";

@Injectable()
export class CoreFlowFederationService {
  private readonly nodes = new Map<string, FederationNode>();

  register(dto: any) {
    const node: FederationNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(dto?.name ?? "core-flow-node"),
      region: String(dto?.region ?? "global"),
      capabilities: Array.isArray(dto?.capabilities)
        ? dto.capabilities.map(String)
        : [],
      status: "joining",
      load: Math.min(Math.max(Number(dto?.load ?? 0), 0), 100),
      lastHeartbeatAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    node.status = "active";
    this.nodes.set(node.id, node);
    return node;
  }

  findAll(query: any = {}) {
    return Array.from(this.nodes.values())
      .filter((node) => !query.status || node.status === query.status)
      .filter((node) => !query.region || node.region === query.region)
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const node = this.nodes.get(id);
    if (!node) throw new NotFoundException("Federation node not found");
    return node;
  }

  heartbeat(id: string, dto: any = {}) {
    const node = this.findOne(id);
    node.load = Math.min(Math.max(Number(dto?.load ?? node.load), 0), 100);
    node.lastHeartbeatAt = new Date().toISOString();
    node.status = node.load >= 90 ? "degraded" : "active";
    return node;
  }

  isolate(id: string) {
    const node = this.findOne(id);
    node.status = "isolated";
    return node;
  }

  retire(id: string) {
    const node = this.findOne(id);
    node.status = "retired";
    return node;
  }

  dashboard() {
    const nodes = Array.from(this.nodes.values());
    return {
      total: nodes.length,
      active: nodes.filter((node) => node.status === "active").length,
      degraded: nodes.filter((node) => node.status === "degraded").length,
      isolated: nodes.filter((node) => node.status === "isolated").length,
      retired: nodes.filter((node) => node.status === "retired").length,
      averageLoad: nodes.length
        ? Number((nodes.reduce((sum, node) => sum + node.load, 0) / nodes.length).toFixed(2))
        : 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
