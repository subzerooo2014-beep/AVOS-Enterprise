import { Injectable } from "@nestjs/common";
import type { FoundationHaNodeV1 } from "./foundation-governance-security-intelligence-v1.types";

@Injectable()
export class FoundationHighAvailabilityV1Service {
  private readonly nodes = new Map<string, FoundationHaNodeV1>();

  heartbeat(
    id: string,
    region: string,
    role: FoundationHaNodeV1["role"],
    status: FoundationHaNodeV1["status"],
  ): FoundationHaNodeV1 {
    const node: FoundationHaNodeV1 = {
      id,
      region,
      role,
      status,
      lastHeartbeatAt: new Date().toISOString(),
    };

    this.nodes.set(node.id, node);
    return { ...node };
  }

  failover(): FoundationHaNodeV1 | undefined {
    const healthyReplica = this.list().find(
      (node) => node.role === "REPLICA" && node.status === "HEALTHY",
    );

    if (!healthyReplica) return undefined;

    const currentPrimary = this.list().find((node) => node.role === "PRIMARY");

    if (currentPrimary) {
      currentPrimary.role = "REPLICA";
      this.nodes.set(currentPrimary.id, currentPrimary);
    }

    healthyReplica.role = "PRIMARY";
    healthyReplica.lastHeartbeatAt = new Date().toISOString();
    this.nodes.set(healthyReplica.id, healthyReplica);

    return { ...healthyReplica };
  }

  list(): FoundationHaNodeV1[] {
    return Array.from(this.nodes.values()).map((item) => ({ ...item }));
  }

  count(): number {
    return this.nodes.size;
  }

  healthyCount(): number {
    return this.list().filter((item) => item.status === "HEALTHY").length;
  }
}
