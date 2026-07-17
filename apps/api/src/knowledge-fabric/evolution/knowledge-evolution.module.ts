import { Module } from "@nestjs/common";
import { KnowledgeCompatibilityService } from "./knowledge-compatibility.service";
import { KnowledgeEvolutionAssessorService } from "./knowledge-evolution-assessor.service";
import { KnowledgeEvolutionController } from "./knowledge-evolution.controller";
import { KnowledgeEvolutionEngineService } from "./knowledge-evolution-engine.service";
import { KnowledgeEvolutionHealthService } from "./knowledge-evolution-health.service";
import { KnowledgeEvolutionPlannerService } from "./knowledge-evolution-planner.service";
import { KnowledgeMergeService } from "./knowledge-merge.service";
import { KnowledgeRetirementService } from "./knowledge-retirement.service";
import { KnowledgeVersionStoreService } from "./knowledge-version-store.service";

@Module({
  controllers: [KnowledgeEvolutionController],
  providers: [KnowledgeVersionStoreService, KnowledgeEvolutionAssessorService, KnowledgeEvolutionPlannerService, KnowledgeEvolutionEngineService, KnowledgeCompatibilityService, KnowledgeMergeService, KnowledgeRetirementService, KnowledgeEvolutionHealthService],
  exports: [KnowledgeVersionStoreService, KnowledgeEvolutionEngineService, KnowledgeCompatibilityService, KnowledgeMergeService, KnowledgeRetirementService, KnowledgeEvolutionHealthService],
})
export class KnowledgeEvolutionModule {}