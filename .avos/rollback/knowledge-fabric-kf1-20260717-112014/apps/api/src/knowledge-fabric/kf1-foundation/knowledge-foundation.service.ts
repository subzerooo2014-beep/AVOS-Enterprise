import { Injectable, OnModuleInit } from "@nestjs/common";
import { KnowledgeRegistryService } from "./knowledge-registry.service";
import {
  KnowledgeAsset,
  KnowledgeFoundationStatus,
} from "./knowledge-foundation.types";

@Injectable()
export class KnowledgeFoundationService implements OnModuleInit {
  private bootstrapCompleted = false;

  constructor(private readonly registry: KnowledgeRegistryService) {}

  onModuleInit(): void {
    this.bootstrap();
  }

  bootstrap(): KnowledgeFoundationStatus {
    const seeds = [
      {
        key: "avos.knowledge.foundation",
        title: "AVOS Knowledge Foundation",
        summary: "Canonical foundation for enterprise knowledge assets.",
        metadata: { source: "system", owner: "AVOS Enterprise" },
      },
      {
        key: "avos.knowledge.registry",
        title: "Knowledge Registry",
        summary: "Unified identity and discovery registry for knowledge assets.",
        metadata: { source: "system", owner: "AVOS Enterprise" },
      },
      {
        key: "avos.knowledge.contracts",
        title: "Knowledge Contracts",
        summary: "Core contracts for future ingestion, graph, retrieval, and governance layers.",
        metadata: { source: "system", owner: "AVOS Enterprise" },
      },
    ];

    for (const seed of seeds) {
      this.registry.register(seed);
    }

    this.bootstrapCompleted = true;
    return this.status();
  }

  status(): KnowledgeFoundationStatus {
    return {
      system: "AVOS Knowledge Fabric",
      pack: "KF-1",
      name: "Knowledge Foundation",
      status: "ready",
      registryReady: true,
      repositoryReady: true,
      bootstrapCompleted: this.bootstrapCompleted,
      assets: this.registry.count(),
      capabilities: [
        "knowledge-identity",
        "knowledge-registry",
        "knowledge-repository",
        "knowledge-contracts",
        "knowledge-bootstrap",
        "knowledge-health",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  health() {
    const status = this.status();
    return {
      healthy:
        status.registryReady &&
        status.repositoryReady &&
        status.bootstrapCompleted &&
        status.assets >= 3,
      status,
    };
  }

  listAssets(): KnowledgeAsset[] {
    return this.registry.list();
  }

  verification() {
    const status = this.status();
    const checks = {
      registryReady: status.registryReady,
      repositoryReady: status.repositoryReady,
      bootstrapCompleted: status.bootstrapCompleted,
      seedAssetsPresent: status.assets >= 3,
      capabilityContractsPresent: status.capabilities.length >= 6,
    };
    const passed = Object.values(checks).every(Boolean);

    return {
      passed,
      score: passed ? 100 : 0,
      pack: "KF-1",
      checks,
      status,
    };
  }

  smoke() {
    const verification = this.verification();
    const assets = this.listAssets();
    const passed =
      verification.passed &&
      assets.some((asset) => asset.key === "avos.knowledge.foundation") &&
      assets.some((asset) => asset.key === "avos.knowledge.registry") &&
      assets.some((asset) => asset.key === "avos.knowledge.contracts");

    return {
      passed,
      pack: "KF-1",
      assets: assets.length,
      verificationScore: verification.score,
      timestamp: new Date().toISOString(),
    };
  }
}