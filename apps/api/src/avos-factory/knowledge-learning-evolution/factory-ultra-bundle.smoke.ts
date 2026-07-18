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

  const workItemId = "work-item:ultra-bundle-smoke";
  coordinator.seedFailureScenario(workItemId);

  const prediction = coordinator.predict(workItemId);
  const rootCause = coordinator.analyzeRootCause(workItemId);
  const recovery = coordinator.createRecovery(workItemId);
  coordinator.approveRecovery(recovery.id, "human:khalifa");
  const completedRecovery = coordinator.executeRecovery(recovery.id);

  const proposal = coordinator.proposeEvolution({
    targetType: "blueprint",
    targetId: "blueprint:enterprise-product",
    title: "Optimize integration validation sequence",
    rationale: "Smoke test identified a synthetic integration failure.",
    expectedImpact: 95,
    riskScore: 15,
  });
  coordinator.approveEvolution(proposal.id, "human:khalifa");

  const optimization = coordinator.optimize(
    "blueprint:enterprise-product",
  );
  const certification = coordinator.certify("human:khalifa");
  const verification = coordinator.status();

  if (prediction.probability <= 0) {
    throw new Error("Failure prediction was not generated.");
  }

  if (rootCause.confidence < 80) {
    throw new Error("Root cause confidence is below smoke threshold.");
  }

  if (completedRecovery.status !== "completed") {
    throw new Error("Autonomous recovery did not complete.");
  }

  if (!certification.certified) {
    throw new Error(
      `Factory certification failed: ${certification.findings.join(", ")}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        stage: "completed",
        packs: verification.packs,
        packCount: verification.packs.length,
        predictionProbability: prediction.probability,
        predictionSeverity: prediction.severity,
        rootCauseConfidence: rootCause.confidence,
        recoveryStatus: completedRecovery.status,
        recoveryApprovedBy: completedRecovery.approvedBy,
        optimizationRecommendations:
          optimization.recommendations.length,
        certificationScore: certification.score,
        certified: certification.certified,
        factoryHealthScore:
          verification.intelligence.factoryHealthScore,
        learningMaturityScore:
          verification.intelligence.learningMaturityScore,
        selfHealingReadinessScore:
          verification.intelligence.selfHealingReadinessScore,
        runtimeReady: verification.healthy,
        humanFinalAuthority: verification.humanFinalAuthority,
      },
      null,
      2,
    ),
  );
}

main();
