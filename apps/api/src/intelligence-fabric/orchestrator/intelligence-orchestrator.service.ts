import { Injectable } from "@nestjs/common";
import {
  IntelligenceDecision,
  IntelligenceRequest,
} from "../contracts/intelligence-fabric.contracts";
import { IntelligenceAnalysisService } from "../analysis/intelligence-analysis.service";
import { IntelligenceReasoningService } from "../reasoning/intelligence-reasoning.service";
import { IntelligenceRuntimeService } from "../runtime/intelligence-runtime.service";
import { IntelligenceSignalRegistryService } from "../signals/intelligence-signal-registry.service";

@Injectable()
export class IntelligenceOrchestratorService {
  constructor(
    private readonly runtime: IntelligenceRuntimeService,
    private readonly registry: IntelligenceSignalRegistryService,
    private readonly analysis: IntelligenceAnalysisService,
    private readonly reasoning: IntelligenceReasoningService,
  ) {}

  async execute(request: IntelligenceRequest): Promise<IntelligenceDecision> {
    const settle = this.runtime.begin();

    try {
      for (const signal of request.signals ?? []) {
        this.registry.register(signal);
      }

      const mergedRequest: IntelligenceRequest = {
        ...request,
        signals:
          request.signals && request.signals.length > 0
            ? request.signals
            : this.registry.list(),
      };

      const insights = this.analysis.analyze(mergedRequest);
      return this.reasoning.decide(mergedRequest, insights);
    } catch (error) {
      this.runtime.fail();
      throw error;
    } finally {
      settle();
    }
  }
}