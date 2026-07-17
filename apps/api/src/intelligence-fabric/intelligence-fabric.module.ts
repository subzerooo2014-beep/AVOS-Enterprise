import { Module } from "@nestjs/common";
import { IntelligenceAnalysisService } from "./analysis/intelligence-analysis.service";
import { IntelligenceFabricController } from "./intelligence-fabric.controller";
import { IntelligenceMetricsService } from "./monitoring/intelligence-metrics.service";
import { IntelligenceOrchestratorService } from "./orchestrator/intelligence-orchestrator.service";
import { IntelligenceReasoningService } from "./reasoning/intelligence-reasoning.service";
import { IntelligenceRuntimeService } from "./runtime/intelligence-runtime.service";
import { IntelligenceSignalRegistryService } from "./signals/intelligence-signal-registry.service";
import { IntelligenceFoundationCertificationService } from "./verification/intelligence-foundation-certification.service";
import { IntelligenceFoundationSmokeService } from "./verification/intelligence-foundation-smoke.service";
import { IntelligenceFoundationVerificationService } from "./verification/intelligence-foundation-verification.service";

@Module({
  controllers: [IntelligenceFabricController],
  providers: [
    IntelligenceRuntimeService,
    IntelligenceSignalRegistryService,
    IntelligenceAnalysisService,
    IntelligenceReasoningService,
    IntelligenceOrchestratorService,
    IntelligenceMetricsService,
    IntelligenceFoundationVerificationService,
    IntelligenceFoundationSmokeService,
    IntelligenceFoundationCertificationService,
  ],
  exports: [
    IntelligenceRuntimeService,
    IntelligenceSignalRegistryService,
    IntelligenceAnalysisService,
    IntelligenceReasoningService,
    IntelligenceOrchestratorService,
    IntelligenceMetricsService,
    IntelligenceFoundationVerificationService,
    IntelligenceFoundationSmokeService,
    IntelligenceFoundationCertificationService,
  ],
})
export class IntelligenceFabricModule {}