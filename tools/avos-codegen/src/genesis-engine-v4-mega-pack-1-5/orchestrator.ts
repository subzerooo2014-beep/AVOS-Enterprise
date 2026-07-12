import { randomUUID } from "node:crypto";
import {
  V4DomainStatus,
  V4EnterpriseIntent,
} from "./contracts";
import { V4IntentNormalizer } from "./intent-normalizer";
import { V4CapabilityDiscovery } from "./capability-discovery";
import { V4DomainInference } from "./domain-inference";
import { V4EnterpriseIntelligence } from "./enterprise-intelligence";

export interface V4DomainIntelligenceResult {
  success: boolean;
  status: V4DomainStatus;
  score: number;
  normalizedIntent: V4EnterpriseIntent;
  capabilities: ReturnType<V4CapabilityDiscovery["discover"]>;
  entities: ReturnType<V4DomainInference["inferEntities"]>;
  relationships: ReturnType<
    V4DomainInference["inferRelationships"]
  >;
  workflows: ReturnType<
    V4EnterpriseIntelligence["inferWorkflows"]
  >;
  roles: ReturnType<V4EnterpriseIntelligence["inferRoles"]>;
  events: ReturnType<V4EnterpriseIntelligence["inferEvents"]>;
  policies: ReturnType<V4EnterpriseIntelligence["inferPolicies"]>;
  risks: ReturnType<V4EnterpriseIntelligence["inferRisks"]>;
  enterpriseBrainPayload: Record<string, unknown>;
  evolutionCenterPayload: Record<string, unknown>;
  evidence: Array<{
    id: string;
    action: string;
    message: string;
    createdAt: string;
  }>;
  completedAt: string;
}

export class GenesisV4DomainIntelligenceOrchestrator {
  constructor(
    readonly normalizer = new V4IntentNormalizer(),
    readonly capabilityDiscovery = new V4CapabilityDiscovery(),
    readonly domainInference = new V4DomainInference(),
    readonly intelligence = new V4EnterpriseIntelligence(),
  ) {}

  execute(
    intent: V4EnterpriseIntent,
  ): V4DomainIntelligenceResult {
    const normalizedIntent = this.normalizer.normalize(intent);
    const capabilities = this.capabilityDiscovery.discover(
      normalizedIntent.domains,
    );
    const entities = this.domainInference.inferEntities(
      normalizedIntent.domains,
    );
    const relationships =
      this.domainInference.inferRelationships(
        normalizedIntent.domains,
      );
    const workflows = this.intelligence.inferWorkflows(
      normalizedIntent.domains,
    );
    const roles = this.intelligence.inferRoles(
      normalizedIntent.domains,
    );
    const events = this.intelligence.inferEvents(
      normalizedIntent.domains,
    );
    const policies = this.intelligence.inferPolicies(
      normalizedIntent.domains,
    );
    const risks = this.intelligence.inferRisks(
      normalizedIntent.domains,
    );

    const domainCoverage =
      normalizedIntent.domains.length === 0
        ? 0
        : Math.round(
            (entities.length / normalizedIntent.domains.length) * 100,
          );

    const intelligenceCoverage = Math.min(
      100,
      Math.round(
        ((capabilities.length +
          workflows.length +
          events.length +
          policies.length) /
          Math.max(1, normalizedIntent.domains.length * 7)) *
          100,
      ),
    );

    const score = Math.round(
      (domainCoverage + intelligenceCoverage + 100) / 3,
    );

    const success =
      normalizedIntent.domains.length > 0 &&
      capabilities.length > 0 &&
      entities.length === normalizedIntent.domains.length &&
      score >= 75;

    const status = success
      ? V4DomainStatus.READY
      : score >= 50
        ? V4DomainStatus.DEGRADED
        : V4DomainStatus.BLOCKED;

    return {
      success,
      status,
      score,
      normalizedIntent,
      capabilities,
      entities,
      relationships,
      workflows,
      roles,
      events,
      policies,
      risks,
      enterpriseBrainPayload: {
        type: "genesis-v4-domain-intelligence",
        systemKey: normalizedIntent.systemKey,
        capabilities,
        entities,
        relationships,
        workflows,
        roles,
        events,
        policies,
        risks,
      },
      evolutionCenterPayload: {
        type: "genesis-v4-domain-baseline",
        systemKey: normalizedIntent.systemKey,
        score,
        domainCount: normalizedIntent.domains.length,
        capabilityCount: capabilities.length,
        workflowCount: workflows.length,
        eventCount: events.length,
        policyCount: policies.length,
        riskCount: risks.length,
      },
      evidence: [
        {
          id: randomUUID(),
          action: "genesis-v4.domain-intelligence.completed",
          message: `Domain intelligence completed with score ${score}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      completedAt: new Date().toISOString(),
    };
  }
}
