import { Injectable } from "@nestjs/common";
import { CoreFlowRuntimeRegistryService } from "./core-flow-runtime-registry.service";
import { CoreFlowRuntimeCoordinatorService } from "./core-flow-runtime-coordinator.service";
import { CoreFlowRuntimeFinalizationService } from "./core-flow-runtime-finalization.service";
import { CoreFlowIntelligenceService } from "./core-flow-intelligence.service";
import { CoreFlowAutonomousOperationsService } from "./core-flow-autonomous-operations.service";

@Injectable()
export class CoreFlowRuntimePlatformService {
  constructor(
    private readonly registry: CoreFlowRuntimeRegistryService,
    private readonly coordinator: CoreFlowRuntimeCoordinatorService,
    private readonly finalization: CoreFlowRuntimeFinalizationService,
    private readonly intelligence: CoreFlowIntelligenceService,
    private readonly autonomy: CoreFlowAutonomousOperationsService,
  ) {}

  orchestrate(executionId: string, dto: any = {}) {
    const coordination = this.coordinator.plan(
      executionId,
      String(dto?.sourceFlow ?? "unknown"),
      Array.isArray(dto?.targetFlows) ? dto.targetFlows : [],
    );
    const intelligence = this.intelligence.analyze(executionId, {
      flow: dto?.sourceFlow,
      durationMs: dto?.durationMs ?? 0,
      targetMs: dto?.targetMs ?? 0,
      attempts: dto?.attempts ?? 0,
      highCost: dto?.highCost ?? false,
    });
    const autonomousPlan = this.autonomy.plan(executionId, {
      flow: dto?.sourceFlow,
      objective: dto?.objective ?? "final-runtime-optimization",
      durationMs: dto?.durationMs,
      targetMs: dto?.targetMs,
      attempts: dto?.attempts,
      riskScore: dto?.riskScore,
      highCost: dto?.highCost,
    });
    return {
      executionId,
      coordination: this.coordinator.execute(coordination.id),
      intelligence,
      autonomousPlan,
      orchestratedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      registry: this.registry.stats(),
      coordination: this.coordinator.findAll().slice(0, 50),
      finalizations: this.finalization.findAll().slice(0, 25),
      generatedAt: new Date().toISOString(),
    };
  }
}
