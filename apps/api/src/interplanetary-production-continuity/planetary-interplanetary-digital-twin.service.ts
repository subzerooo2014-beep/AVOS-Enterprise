import { Injectable } from "@nestjs/common";
import { InterplanetaryProductionContinuityStore } from "./interplanetary-production-continuity.store";

@Injectable()
export class PlanetaryInterplanetaryDigitalTwinService {
  constructor(private readonly store: InterplanetaryProductionContinuityStore) {}

  snapshot() {
    const average = (values: number[]) =>
      values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0;

    return {
      id: this.store.id("civilization-digital-twin"),
      planetaryLayer: "PPI-SGF operational dependency",
      interplanetaryNodes: this.store.nodes.length,
      operationalNodes: this.store.nodes.filter((node) => node.status === "operational").length,
      totalCapacity: this.store.nodes.reduce((sum, node) => sum + node.availableCapacity, 0),
      averageAutonomyScore: average(this.store.nodes.map((node) => node.autonomyScore)),
      averageResilienceScore: average(this.store.nodes.map((node) => node.resilienceScore)),
      averageTrustScore: average(this.store.nodes.map((node) => node.trustScore)),
      continuityScenarios: this.store.scenarios.length,
      recoveryPlans: this.store.recoveryPlans.length,
      preservedArtifacts: this.store.memoryArtifacts.length,
      infrastructureExpansions: this.store.expansions.length,
      governanceProposals: this.store.governanceProposals.length,
      communicationModel: "delay-tolerant and eventually consistent",
      humanFinalAuthority: true,
      createdAt: this.store.now(),
    };
  }
}