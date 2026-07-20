import { Injectable, OnModuleInit } from "@nestjs/common";
import { UrpRuntimeRegistryService } from "./urp-runtime-registry.service";

@Injectable()
export class UrpPlatformCatalogService implements OnModuleInit {
  constructor(private readonly registry: UrpRuntimeRegistryService) {}

  onModuleInit() {
    const units = [
      {
        key: "foundation",
        name: "AVOS Foundation",
        version: "20",
        kind: "foundation" as const,
        dependencies: [],
        capabilities: ["governance", "trust", "compliance", "metadata"],
      },
      {
        key: "enterprise-kernel",
        name: "AVOS Enterprise Kernel",
        version: "1.0",
        kind: "kernel" as const,
        dependencies: ["foundation"],
        capabilities: ["kernel-runtime", "certification", "coordination"],
      },
      {
        key: "capability-fabric",
        name: "AVOS Capability Fabric",
        version: "CF-5",
        kind: "fabric" as const,
        dependencies: ["foundation", "enterprise-kernel"],
        capabilities: ["capability-registry", "lifecycle", "orchestration"],
      },
      {
        key: "knowledge-fabric",
        name: "AVOS Knowledge Fabric",
        version: "KF-6",
        kind: "fabric" as const,
        dependencies: ["foundation", "enterprise-kernel"],
        capabilities: ["knowledge-graph", "retrieval", "governance"],
      },
      {
        key: "intelligence-fabric",
        name: "AVOS Intelligence Fabric",
        version: "IF-6",
        kind: "fabric" as const,
        dependencies: [
          "foundation",
          "enterprise-kernel",
          "knowledge-fabric",
          "capability-fabric",
        ],
        capabilities: ["reasoning", "multi-agent", "decision", "learning"],
      },
      {
        key: "enterprise-brain",
        name: "AVOS Enterprise Brain",
        version: "1.0",
        kind: "brain" as const,
        dependencies: ["intelligence-fabric", "knowledge-fabric"],
        capabilities: ["enterprise-reasoning", "planning"],
      },
      {
        key: "enterprise-nervous-system",
        name: "AVOS Enterprise Nervous System",
        version: "1.0",
        kind: "platform" as const,
        dependencies: ["enterprise-kernel", "capability-fabric"],
        capabilities: ["events", "signals", "real-time-coordination"],
      },
      {
        key: "execution-core",
        name: "AVOS Execution Core",
        version: "ECF-1.0.0",
        kind: "execution" as const,
        dependencies: [
          "enterprise-kernel",
          "capability-fabric",
          "enterprise-nervous-system",
        ],
        capabilities: ["execution", "approval", "risk-control"],
      },
      {
        key: "adaptive-growth-studio",
        name: "AVOS Adaptive Growth Studio",
        version: "AGS-1.1.0",
        kind: "studio" as const,
        dependencies: [
          "execution-core",
          "intelligence-fabric",
          "knowledge-fabric",
        ],
        capabilities: [
          "growth-design",
          "durable-workflows",
          "distributed-queue",
          "event-store",
        ],
      },
    ];

    for (const unit of units) {
      this.registry.register({
        ...unit,
        status: "registered",
        metadata: {
          foundationFirst: true,
          capabilityFirst: true,
          blueprintDriven: true,
          humanFinalAuthority: true,
        },
      });
    }
  }
}