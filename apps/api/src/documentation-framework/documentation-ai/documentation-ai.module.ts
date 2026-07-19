import { Module } from "@nestjs/common";
import { DocumentationAiController } from "./documentation-ai.controller";
import { DocumentationAiOrchestratorService } from "./documentation-ai-orchestrator.service";
import { DocumentationAutoGovernanceService } from "./documentation-auto-governance.service";
import { DocumentationEvolutionEngineService } from "./documentation-evolution-engine.service";
import { DocumentationGapDetectorService } from "./documentation-gap-detector.service";
import { DocumentationImpactAnalysisService } from "./documentation-impact-analysis.service";
import { DocumentationQualityEngineService } from "./documentation-quality-engine.service";
import { DocumentationRecommendationEngineService } from "./documentation-recommendation-engine.service";

@Module({
  controllers: [DocumentationAiController],
  providers: [
    DocumentationGapDetectorService,
    DocumentationQualityEngineService,
    DocumentationRecommendationEngineService,
    DocumentationImpactAnalysisService,
    DocumentationEvolutionEngineService,
    DocumentationAutoGovernanceService,
    DocumentationAiOrchestratorService,
  ],
  exports: [
    DocumentationGapDetectorService,
    DocumentationQualityEngineService,
    DocumentationRecommendationEngineService,
    DocumentationImpactAnalysisService,
    DocumentationEvolutionEngineService,
    DocumentationAutoGovernanceService,
    DocumentationAiOrchestratorService,
  ],
})
export class DocumentationAiModule {}

export { DocumentationAiModule as DocumentationAIModule };