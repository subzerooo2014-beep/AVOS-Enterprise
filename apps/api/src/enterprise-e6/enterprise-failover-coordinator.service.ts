import { Injectable } from "@nestjs/common";

@Injectable()
export class EnterpriseFailoverCoordinatorService {
  private readonly nodes = new Map<
    string,
    { name: string; healthy: boolean; priority: number }
  >();

  register(name: string, priority = 100, healthy = true) {
    const node = { name, healthy, priority };
    this.nodes.set(name, node);
    return node;
  }

  setHealth(name: string, healthy: boolean) {
    const node = this.nodes.get(name);
    if (!node) {
      return null;
    }

    node.healthy = healthy;
    return node;
  }

  activeNode() {
    return this.list()
      .filter((node) => node.healthy)
      .sort((a, b) => a.priority - b.priority)[0] || null;
  }

  failover() {
    const active = this.activeNode();

    return {
      success: active !== null,
      activeNode: active,
      availableNodes: this.list().filter((node) => node.healthy).length,
      coordinatedAt: new Date().toISOString(),
    };
  }

  list() {
    return [...this.nodes.values()];
  }
}