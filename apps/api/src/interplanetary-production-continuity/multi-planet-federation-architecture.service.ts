import { Injectable, NotFoundException } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class MultiPlanetFederationArchitectureService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  listNodes() {
    return this.store.nodes;
  }

  getNode(id: string) {
    const node = this.store.nodes.find((item) => item.id === id);
    if (!node) throw new NotFoundException(`Interplanetary node not found: ${id}`);
    return node;
  }

  federationStatus() {
    return {
      nodes: this.store.nodes.length,
      operationalNodes: this.store.nodes.filter((node) => node.status === "operational").length,
      totalCapacity: this.store.nodes.reduce((sum, node) => sum + node.availableCapacity, 0),
      architecture: "delay-tolerant sovereign federation",
      rawAuthorityTransfer: false,
      localAutonomy: true,
      humanFinalAuthority: true,
    };
  }
}