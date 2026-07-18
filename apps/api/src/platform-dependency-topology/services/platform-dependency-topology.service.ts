import { Injectable } from "@nestjs/common";
import { PlatformDependencyGraphService } from "./platform-dependency-graph.service";
import { PlatformDependencyRegistryService } from "./platform-dependency-registry.service";
import { PlatformDependencyValidationService } from "./platform-dependency-validation.service";
import { PlatformExecutionPlannerService } from "./platform-execution-planner.service";
import { PlatformImpactAnalysisService } from "./platform-impact-analysis.service";
import { PlatformTopologyAnalysisService } from "./platform-topology-analysis.service";

@Injectable()
export class PlatformDependencyTopologyService {
  constructor(
    private readonly registry: PlatformDependencyRegistryService,
    private readonly graph: PlatformDependencyGraphService,
    private readonly validation: PlatformDependencyValidationService,
    private readonly planner: PlatformExecutionPlannerService,
    private readonly impact: PlatformImpactAnalysisService,
    private readonly topology: PlatformTopologyAnalysisService
  ) {}

  status() {
    return {
      success: true,
      system: "AVOS Platform Dependency & Topology Engine",
      stage: "Platform",
      pack: "2",
      version: "1.0.0",
      status: "operational",
      capabilities: [
        "dependency-registry",
        "dependency-graph",
        "circular-dependency-detection",
        "startup-planning",
        "shutdown-planning",
        "impact-analysis",
        "topology-analysis",
        "final-review",
        "certification"
      ],
      health: this.health(),
      generatedAt: new Date().toISOString()
    };
  }

  health() {
    const validation = this.validation.validate();
    const topology = this.topology.analyze();
    const score = Math.min(validation.score, topology.topologyScore);

    return {
      system: "AVOS Platform Dependency & Topology Engine",
      status: score >= 90 ? "healthy" : score >= 70 ? "degraded" : "unhealthy",
      score,
      dependencies: this.registry.list().length,
      services: topology.services,
      links: topology.links,
      cycles: this.graph.detectCycles().length,
      singlePointsOfFailure: topology.singlePointsOfFailure.length,
      generatedAt: new Date().toISOString()
    };
  }

  finalReview() {
    const validation = this.validation.validate();
    const startup = this.planner.startup();
    const shutdown = this.planner.shutdown();
    const topology = this.topology.analyze();
    const health = this.health();

    const checks = {
      dependencyRegistryAvailable: true,
      graphAvailable: true,
      validationPassed: validation.status === "passed",
      startupPlanValid: startup.valid,
      shutdownPlanValid: shutdown.valid,
      topologyAvailable: topology.services >= 0,
      healthAcceptable: health.score === 100
    };

    const passed = Object.values(checks).every(Boolean);

    return {
      id: `platform-dependency-topology-final-review:${Date.now()}`,
      system: "AVOS Platform Dependency & Topology Engine",
      pack: "2",
      status: passed ? "passed" : "failed",
      score: passed ? 100 : health.score,
      checks,
      validation,
      startup,
      shutdown,
      topology,
      health,
      reviewedAt: new Date().toISOString()
    };
  }

  certification() {
    const review = this.finalReview();

    return {
      id: `platform-dependency-topology-certification:${Date.now()}`,
      reviewId: review.id,
      system: "AVOS Platform Dependency & Topology Engine",
      pack: "2",
      status: review.status === "passed" && review.score === 100
        ? "certified"
        : "rejected",
      score: review.score,
      level: review.score === 100 ? "excellent" : "not-certified",
      certifiedAt: new Date().toISOString()
    };
  }
}