import { Injectable } from "@nestjs/common";
import { CoreFlowAutonomyService } from "./core-flow-autonomy.service";
import { CoreFlowExperimentService } from "./core-flow-experiment.service";
import { CoreFlowBenchmarkService } from "./core-flow-benchmark.service";
import { CoreFlowReleaseService } from "./core-flow-release.service";
import { CoreFlowOptimizationService } from "./core-flow-optimization.service";
import { CoreFlowRecommendationService } from "./core-flow-recommendation.service";

@Injectable()
export class CoreFlowAutonomousOperationsService {
  constructor(
    private readonly autonomy: CoreFlowAutonomyService,
    private readonly experiments: CoreFlowExperimentService,
    private readonly benchmarks: CoreFlowBenchmarkService,
    private readonly releases: CoreFlowReleaseService,
    private readonly optimizations: CoreFlowOptimizationService,
    private readonly recommendations: CoreFlowRecommendationService,
  ) {}

  plan(executionId: string, dto: any = {}) {
    const recommendations = this.recommendations.generate(executionId, dto);
    const optimization = this.optimizations.create(
      String(dto?.flow ?? "unknown"),
      String(dto?.objective ?? "autonomous-improvement"),
      dto?.signals ?? dto,
    );
    const actions = recommendations.map((recommendation) =>
      this.autonomy.propose({
        executionId,
        flow: dto?.flow,
        action: recommendation.title,
        rationale: recommendation.rationale,
        confidence: recommendation.confidence,
        riskScore: dto?.riskScore ?? 0,
      }),
    );
    return { executionId, recommendations, optimization, actions, plannedAt: new Date().toISOString() };
  }

  runExperiment(dto: any = {}) {
    const experiment = this.experiments.create(dto);
    this.experiments.start(experiment.id);
    return experiment;
  }

  benchmark(dto: any = {}) {
    return this.benchmarks.record(
      String(dto?.flow ?? "unknown"),
      String(dto?.metric ?? "successRate"),
      Number(dto?.value ?? 0),
      Number(dto?.baseline ?? 0),
    );
  }

  dashboard() {
    return {
      autonomy: this.autonomy.dashboard(),
      experiments: this.experiments.findAll(),
      benchmarks: this.benchmarks.dashboard(),
      releases: this.releases.findAll(),
      optimizations: this.optimizations.findAll(),
      generatedAt: new Date().toISOString(),
    };
  }
}
