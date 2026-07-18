import { AutonomousFactoryRecoveryService } from "./autonomous-factory-recovery.service";
import { BlueprintCapabilityOptimizationService } from "./blueprint-capability-optimization.service";
import { ContinuousFactoryLearningService } from "./continuous-factory-learning.service";
import { FactoryDigitalDnaService } from "./factory-digital-dna.service";
import { FactoryEnterpriseCertificationService } from "./factory-enterprise-certification.service";
import { FactoryEvolutionEngineService } from "./factory-evolution-engine.service";
import { FactoryExperienceReplayService } from "./factory-experience-replay.service";
import { FactoryKnowledgeEvolutionCoordinatorService } from "./factory-knowledge-evolution-coordinator.service";
import { FactoryKnowledgeGraphService } from "./factory-knowledge-graph.service";
import { FactoryKnowledgeService } from "./factory-knowledge.service";
import { FactoryRootCauseAnalysisService } from "./factory-root-cause-analysis.service";
import { PredictiveFailureIntelligenceService } from "./predictive-failure-intelligence.service";
import { ProductionMemoryService } from "./production-memory.service";

function createCoordinator() {
  const memory = new ProductionMemoryService();
  return new FactoryKnowledgeEvolutionCoordinatorService(
    new FactoryKnowledgeService(),
    memory,
    new ContinuousFactoryLearningService(),
    new FactoryExperienceReplayService(memory),
    new FactoryEvolutionEngineService(),
    new BlueprintCapabilityOptimizationService(),
    new PredictiveFailureIntelligenceService(),
    new FactoryRootCauseAnalysisService(),
    new AutonomousFactoryRecoveryService(),
    new FactoryDigitalDnaService(),
    new FactoryKnowledgeGraphService(),
    new FactoryEnterpriseCertificationService(),
  );
}

function main() {
  const coordinator = createCoordinator();
  coordinator.bootstrap();
  const verification = coordinator.status();

  const required = [
    "factory-knowledge-platform",
    "production-memory",
    "continuous-learning-engine",
    "experience-replay",
    "factory-evolution-engine",
    "blueprint-optimization",
    "predictive-failure-detection",
    "root-cause-analysis",
    "self-healing-factory",
    "autonomous-recovery-planner",
    "factory-digital-dna",
    "factory-knowledge-graph",
    "enterprise-certification-center",
    "executive-factory-intelligence",
  ];

  const missing = required.filter(
    (capability) => !verification.capabilities.includes(capability),
  );

  if (!verification.healthy) {
    throw new Error("Factory Ultra Bundle verification is unhealthy.");
  }

  if (!verification.humanFinalAuthority) {
    throw new Error("Human Final Authority must remain enabled.");
  }

  if (verification.packs.length !== 15) {
    throw new Error(
      `Expected 15 packs but received ${verification.packs.length}.`,
    );
  }

  if (missing.length > 0) {
    throw new Error(`Missing capabilities: ${missing.join(", ")}`);
  }

  console.log(
    JSON.stringify(
      {
        stage: "verified",
        classification: verification.classification,
        version: verification.version,
        packs: verification.packs,
        packCount: verification.packs.length,
        capabilities: verification.capabilities.length,
        healthy: verification.healthy,
        humanFinalAuthority: verification.humanFinalAuthority,
        intelligence: verification.intelligence,
      },
      null,
      2,
    ),
  );
}

main();
