import { Injectable } from "@nestjs/common";
import {
  UrpEndpointCandidate,
  UrpRuntimeAdapterDefinition,
} from "./urp-production.contracts";

@Injectable()
export class UrpAdapterCatalogService {
  private readonly adapters = new Map<string, UrpRuntimeAdapterDefinition>();

  constructor() {
    this.seed();
  }

  get(key: string): UrpRuntimeAdapterDefinition {
    const adapter = this.adapters.get(key);
    if (!adapter) throw new Error("URP production adapter not found: " + key);
    return adapter;
  }

  list(): UrpRuntimeAdapterDefinition[] {
    return [...this.adapters.values()];
  }

  candidates(
    key: string,
    operation?: UrpEndpointCandidate["operation"],
  ): UrpEndpointCandidate[] {
    const candidates = this.get(key).endpointCandidates;
    return candidates
      .filter((item) => !operation || item.operation === operation)
      .sort((a, b) => a.priority - b.priority);
  }

  private register(definition: UrpRuntimeAdapterDefinition) {
    this.adapters.set(definition.key, definition);
  }

  private seed() {
    const common = {
      metadata: {
        productionIntegration: true,
        foundationFirst: true,
        humanFinalAuthority: true,
      },
    };

    this.register({
      ...common,
      key: "foundation",
      name: "Foundation Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["foundation.*", "governance.*", "compliance.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/foundation-control/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/foundation-control/status", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/foundation-control/status", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "enterprise-kernel",
      name: "Enterprise Kernel Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["kernel.*", "certification.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/enterprise-kernel/final-health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/enterprise-kernel/status", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/enterprise-kernel/certification/status", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "capability-fabric",
      name: "Capability Fabric Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["capability.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/capability-fabric/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/capability-fabric/runtime/status", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/capability-fabric/certification/status", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "knowledge-fabric",
      name: "Knowledge Fabric Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["knowledge.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/knowledge-fabric/production/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/knowledge-fabric/final-review/status", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/knowledge-fabric/certification/status", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "intelligence-fabric",
      name: "Intelligence Fabric Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["intelligence.*", "decision.*", "agent.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/intelligence-fabric/runtime/status", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/intelligence-fabric/advanced/if6/evolution", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/intelligence-fabric/advanced/if6/certification/status", priority: 1 },
        { operation: "command", method: "POST", path: "/avos/intelligence-fabric/runtime/analyze", priority: 1 },
        { operation: "query", method: "POST", path: "/avos/intelligence-fabric/runtime/analyze", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "enterprise-brain",
      name: "Enterprise Brain Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["brain.*", "planning.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/enterprise-brain/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/enterprise-brain/status", priority: 2 },
      ],
    });

    this.register({
      ...common,
      key: "enterprise-nervous-system",
      name: "Enterprise Nervous System Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["nervous-system.*", "signal.*", "event.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/enterprise-nervous-system/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/enterprise-nervous-system/status", priority: 2 },
        { operation: "event", method: "POST", path: "/avos/enterprise-nervous-system/events", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "execution-core",
      name: "Execution Core Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["execution.*", "workflow.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/execution/status", priority: 1 },
        { operation: "readiness", method: "POST", path: "/avos/execution/boot", priority: 1 },
        { operation: "boot", method: "POST", path: "/avos/execution/boot", priority: 1 },
      ],
    });

    this.register({
      ...common,
      key: "adaptive-growth-studio",
      name: "AGS Runtime Adapter",
      version: "URP-1.1",
      eventTopics: ["ags.*", "growth.*"],
      endpointCandidates: [
        { operation: "health", method: "GET", path: "/avos/ags/health", priority: 1 },
        { operation: "health", method: "GET", path: "/avos/ags/status", priority: 2 },
        { operation: "readiness", method: "GET", path: "/avos/ags/certification/status", priority: 1 },
      ],
    });
  }
}