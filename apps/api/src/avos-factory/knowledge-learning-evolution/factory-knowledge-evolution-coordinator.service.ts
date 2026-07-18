import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { AutonomousFactoryRecoveryService } from "./autonomous-factory-recovery.service";
import { BlueprintCapabilityOptimizationService } from "./blueprint-capability-optimization.service";
import { ContinuousFactoryLearningService } from "./continuous-factory-learning.service";
import { FactoryDigitalDnaService } from "./factory-digital-dna.service";
import { FactoryEnterpriseCertificationService } from "./factory-enterprise-certification.service";
import { FactoryEvolutionEngineService } from "./factory-evolution-engine.service";
import { FactoryExperienceReplayService } from "./factory-experience-replay.service";
import {
  ExecutiveFactoryIntelligence,
  FactoryUltraVerification,
  LearningSignalType,
} from "./factory-knowledge.contracts";
import { FactoryKnowledgeGraphService } from "./factory-knowledge-graph.service";
import { FactoryKnowledgeService } from "./factory-knowledge.service";
import { FactoryRootCauseAnalysisService } from "./factory-root-cause-analysis.service";
import { PredictiveFailureIntelligenceService } from "./predictive-failure-intelligence.service";
import { ProductionMemoryService } from "./production-memory.service";

@Injectable()
export class FactoryKnowledgeEvolutionCoordinatorService {
  constructor(
    private readonly knowledge: FactoryKnowledgeService,
    private readonly memory: ProductionMemoryService,
    private readonly learning: ContinuousFactoryLearningService,
    private readonly replayService: FactoryExperienceReplayService,
    private readonly evolution: FactoryEvolutionEngineService,
    private readonly optimization: BlueprintCapabilityOptimizationService,
    private readonly prediction: PredictiveFailureIntelligenceService,
    private readonly rootCause: FactoryRootCauseAnalysisService,
    private readonly recovery: AutonomousFactoryRecoveryService,
    private readonly dna: FactoryDigitalDnaService,
    private readonly graph: FactoryKnowledgeGraphService,
    private readonly certification:
      FactoryEnterpriseCertificationService,
  ) {}

  bootstrap() {
    if (this.graph.nodeCount() > 0) {
      return this.status();
    }

    this.knowledge.capture({
      type: "blueprint",
      sourceId: "blueprint:enterprise-product",
      title: "Enterprise Product Blueprint Knowledge",
      summary:
        "Governed knowledge record for reusable enterprise product creation.",
      tags: ["blueprint", "enterprise", "factory"],
      trustScore: 100,
    });

    this.memory.remember({
      workItemId: "bootstrap:factory-ultra-16-30",
      stage: "knowledge-initialization",
      outcome: "success",
      qualityScore: 100,
      durationMs: 500,
      resourceUnits: 5,
      decisionIds: ["decision:human-final-authority"],
      metadata: { bootstrap: true },
    });

    const signalTypes: LearningSignalType[] = [
      "success",
      "quality",
      "resource",
      "governance",
    ];

    for (const type of signalTypes) {
      this.learning.recordSignal({
        workItemId: "bootstrap:factory-ultra-16-30",
        type,
        value: type === "resource" ? 85 : 100,
        weight: 1,
        context: { bootstrap: true },
      });
    }

    this.dna.register({
      entityType: "factory",
      entityId: "avos-factory",
      purpose: "Governed autonomous production and evolution.",
      dependencies: [
        "genesis-engine",
        "codegen-os",
        "capability-fabric",
        "knowledge-fabric",
        "living-blueprint",
      ],
      policies: [
        "foundation-first",
        "human-final-authority",
        "audit-by-design",
        "rollback-by-design",
      ],
      metrics: [
        "quality-score",
        "learning-maturity",
        "self-healing-readiness",
      ],
      versionHistory: ["16.0.0", "30.0.0"],
      evolutionHistory: [
        "knowledge-platform-enabled",
        "learning-enabled",
        "self-healing-enabled",
      ],
      trustScore: 100,
    });

    this.graph.addNode({
      id: "factory:avos",
      type: "factory",
      label: "AVOS Factory",
      metadata: { version: "30.0.0" },
    });
    this.graph.addNode({
      id: "blueprint:enterprise-product",
      type: "blueprint",
      label: "Enterprise Product Blueprint",
      metadata: { governed: true },
    });
    this.graph.addNode({
      id: "capability:human-final-authority",
      type: "capability",
      label: "Human Final Authority",
      metadata: { mandatory: true },
    });
    this.graph.connect({
      source: "factory:avos",
      target: "blueprint:enterprise-product",
      relation: "produces-from",
      weight: 1,
    });
    this.graph.connect({
      source: "factory:avos",
      target: "capability:human-final-authority",
      relation: "governed-by",
      weight: 1,
    });

    return this.status();
  }

  captureKnowledge(input: Parameters<FactoryKnowledgeService["capture"]>[0]) {
    return this.knowledge.capture(input);
  }

  remember(input: Parameters<ProductionMemoryService["remember"]>[0]) {
    return this.memory.remember(input);
  }

  learn(input: Parameters<ContinuousFactoryLearningService["recordSignal"]>[0]) {
    return this.learning.recordSignal(input);
  }

  replay(workItemId: string) {
    return this.replayService.replay(workItemId);
  }

  patterns() {
    return this.learning.detectPatterns();
  }

  proposeEvolution(input: Parameters<FactoryEvolutionEngineService["propose"]>[0]) {
    return this.evolution.propose(input);
  }

  approveEvolution(id: string, approvedBy: string) {
    return this.evolution.approve(id, approvedBy);
  }

  optimize(targetId: string) {
    return this.optimization.optimize(
      targetId,
      this.memory.all(),
      this.patterns(),
    );
  }

  predict(targetId: string) {
    return this.prediction.predict(targetId, this.memory.all());
  }

  analyzeRootCause(workItemId: string) {
    return this.rootCause.analyze(
      workItemId,
      this.memory.byWorkItem(workItemId),
    );
  }

  createRecovery(workItemId: string) {
    return this.recovery.createPlan(this.analyzeRootCause(workItemId));
  }

  approveRecovery(id: string, approvedBy: string) {
    return this.recovery.approve(id, approvedBy);
  }

  executeRecovery(id: string) {
    return this.recovery.execute(id);
  }

  registerDna(input: Parameters<FactoryDigitalDnaService["register"]>[0]) {
    return this.dna.register(input);
  }

  graphSnapshot() {
    return this.graph.snapshot();
  }

  intelligence(): ExecutiveFactoryIntelligence {
    const patterns = this.patterns();
    const memories = this.memory.all();
    const failed = memories.filter((record) => record.outcome === "failure");

    const factoryHealthScore = Math.max(0, 100 - failed.length * 10);
    const learningMaturityScore = Math.min(
      100,
      70 + this.learning.signalCount() * 5,
    );
    const selfHealingReadinessScore = Math.min(
      100,
      90 + this.recovery.count() * 2,
    );

    return {
      knowledgeRecords: this.knowledge.count(),
      memoryRecords: this.memory.count(),
      learningSignals: this.learning.signalCount(),
      detectedPatterns: patterns.length,
      evolutionProposals: this.evolution.count(),
      predictions: memories.length > 0 ? 1 : 0,
      recoveryPlans: this.recovery.count(),
      graphNodes: this.graph.nodeCount(),
      graphEdges: this.graph.edgeCount(),
      factoryHealthScore,
      learningMaturityScore,
      selfHealingReadinessScore,
    };
  }

  certify(approvedBy: string) {
    return this.certification.certify(
      this.intelligence(),
      approvedBy,
    );
  }

  status(): FactoryUltraVerification {
    return {
      classification:
        "factory-knowledge-learning-evolution-self-healing",
      version: "30.0.0",
      healthy: true,
      humanFinalAuthority: true,
      packs: [
        16, 17, 18, 19, 20,
        21, 22, 23, 24, 25,
        26, 27, 28, 29, 30,
      ],
      capabilities: [
        "factory-knowledge-platform",
        "production-knowledge-base",
        "blueprint-knowledge",
        "capability-knowledge",
        "decision-knowledge",
        "failure-knowledge",
        "production-memory",
        "operational-memory",
        "decision-memory",
        "historical-replay",
        "continuous-learning-engine",
        "success-learning",
        "failure-learning",
        "pattern-learning",
        "experience-replay",
        "pattern-detection",
        "failure-pattern-intelligence",
        "factory-evolution-engine",
        "blueprint-evolution",
        "capability-evolution",
        "workflow-evolution",
        "evolution-scoring",
        "blueprint-optimization",
        "capability-learning",
        "bottleneck-detection",
        "predictive-failure-detection",
        "root-cause-analysis",
        "self-healing-factory",
        "autonomous-recovery-planner",
        "human-approved-recovery",
        "factory-digital-dna",
        "factory-genome",
        "blueprint-genome",
        "capability-genome",
        "factory-knowledge-graph",
        "dependency-knowledge-graph",
        "enterprise-certification-center",
        "executive-factory-intelligence",
        "factory-health-score",
        "learning-maturity-score",
        "self-healing-readiness-score",
        "genesis-engine-integration-contract",
        "codegen-os-integration-contract",
        "capability-fabric-integration-contract",
        "knowledge-fabric-integration-contract",
        "living-blueprint-integration-contract",
        "digital-dna-integration-contract",
      ],
      intelligence: this.intelligence(),
    };
  }

  seedFailureScenario(workItemId: string) {
    this.memory.remember({
      workItemId,
      stage: "integration-validation",
      outcome: "failure",
      qualityScore: 72,
      durationMs: 45000,
      resourceUnits: 80,
      decisionIds: [randomUUID()],
      metadata: { synthetic: true },
    });
    this.learning.recordSignal({
      workItemId,
      type: "failure",
      value: 75,
      weight: 2,
      context: { stage: "integration-validation" },
    });
    return this.analyzeRootCause(workItemId);
  }
}
