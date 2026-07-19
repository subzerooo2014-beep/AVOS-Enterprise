import { Injectable } from "@nestjs/common";
import {
  ContinuityScenario,
  GovernanceEvolutionProposal,
  InfrastructureExpansion,
  InterplanetaryNode,
  MemoryArtifact,
  RecoveryPlan,
} from "./interplanetary-production-continuity.types";

@Injectable()
export class InterplanetaryProductionContinuityStore {
  readonly nodes: InterplanetaryNode[] = [
    {
      id: "civilization-node:earth",
      name: "AVOS Earth Civilization Grid",
      celestialBody: "Earth",
      habitat: "planetary-multi-region",
      jurisdictionModel: "federated-sovereign",
      status: "operational",
      autonomyScore: 96,
      resilienceScore: 98,
      trustScore: 100,
      availableCapacity: 2400,
      communicationDelayMinutes: 0,
      supportedCapabilities: ["production", "knowledge", "governance", "recovery", "manufacturing"],
      humanAuthorityRequired: true,
    },
    {
      id: "civilization-node:lunar",
      name: "AVOS Lunar Continuity Grid",
      celestialBody: "Moon",
      habitat: "distributed-lunar-habitats",
      jurisdictionModel: "human-chartered-autonomous",
      status: "operational",
      autonomyScore: 94,
      resilienceScore: 93,
      trustScore: 99,
      availableCapacity: 480,
      communicationDelayMinutes: 0.03,
      supportedCapabilities: ["production", "knowledge", "recovery", "manufacturing"],
      humanAuthorityRequired: true,
    },
    {
      id: "civilization-node:mars",
      name: "AVOS Mars Continuity Grid",
      celestialBody: "Mars",
      habitat: "distributed-martian-habitats",
      jurisdictionModel: "human-chartered-autonomous",
      status: "operational",
      autonomyScore: 97,
      resilienceScore: 95,
      trustScore: 98,
      availableCapacity: 620,
      communicationDelayMinutes: 12,
      supportedCapabilities: ["production", "knowledge", "recovery", "manufacturing", "expansion"],
      humanAuthorityRequired: true,
    },
  ];

  readonly scenarios: ContinuityScenario[] = [];
  readonly recoveryPlans: RecoveryPlan[] = [];
  readonly memoryArtifacts: MemoryArtifact[] = [];
  readonly expansions: InfrastructureExpansion[] = [];
  readonly governanceProposals: GovernanceEvolutionProposal[] = [];

  id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(16).slice(2, 10)}`;
  }

  now(): string {
    return new Date().toISOString();
  }
}