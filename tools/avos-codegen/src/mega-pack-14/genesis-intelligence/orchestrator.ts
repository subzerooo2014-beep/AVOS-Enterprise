import {
  AdaptiveGenesisBlueprintOptimizer,
} from "./adaptive-blueprint-optimizer";
import {
  AiGenesisGenerationPlanner,
} from "./ai-generation-planner";
import {
  AutonomousGenesisValidationPipeline,
} from "./autonomous-validation-pipeline";
import {
  CrossSystemDependencyAnalyzer,
} from "./cross-system-dependency-analyzer";
import {
  GenesisDecisionResult,
  GenesisDependencyNode,
  GenesisIntelligenceResult,
  GenesisKnowledgeRecord,
  GenesisOptimizationContext,
  GenesisPlanningConstraint,
  GenesisPlanningObjective,
} from "./contracts";
import {
  GenesisIntelligenceDecisionEngine,
} from "./decision-engine";
import {
  GenesisKnowledgeSynchronizer,
} from "./knowledge-synchronizer";

export interface GenesisIntelligenceInput {
  optimization:
    GenesisOptimizationContext;
  dependencyNodes:
    GenesisDependencyNode[];
  objectives:
    GenesisPlanningObjective[];
  constraints:
    GenesisPlanningConstraint[];
  knowledge:
    Omit<
      GenesisKnowledgeRecord,
      "id" | "createdAt" | "updatedAt"
    >[];
}

export class GenesisIntelligenceOrchestrator {
  readonly optimizer =
    new AdaptiveGenesisBlueprintOptimizer();

  readonly dependencies =
    new CrossSystemDependencyAnalyzer();

  readonly planner =
    new AiGenesisGenerationPlanner();

  readonly validation =
    new AutonomousGenesisValidationPipeline();

  readonly decisions =
    new GenesisIntelligenceDecisionEngine();

  readonly knowledge =
    new GenesisKnowledgeSynchronizer();

  execute(
    input:
      GenesisIntelligenceInput,
  ): GenesisIntelligenceResult {
    const optimization =
      this.optimizer.optimize(
        input.optimization,
      );

    const dependencyAnalysis =
      this.dependencies.analyze(
        input.dependencyNodes,
      );

    const plan =
      this.planner.plan({
        systemKey:
          input.optimization.systemKey,
        objectives:
          input.objectives,
        constraints:
          input.constraints,
        optimization,
        dependencyAnalysis,
        metadata: {},
      });

    const validation =
      this.validation.validate({
        optimization,
        dependencyAnalysis,
        plan,
        metadata: {},
      });

    const decision:
      GenesisDecisionResult =
      this.decisions.decide(
        plan,
        validation,
      );

    const knowledge =
      this.knowledge.synchronize(
        input.knowledge,
      );

    return {
      success:
        decision.approved,
      optimization,
      dependencyAnalysis,
      plan,
      validation,
      decision,
      knowledge,
      completedAt:
        new Date().toISOString(),
    };
  }
}
