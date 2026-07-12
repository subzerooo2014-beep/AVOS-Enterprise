export interface RealityOptimizationDomain {
  key: string;
  currentScore: number;
  targetScore: number;
  effort: number;
  impact: number;
}

export interface RealityOptimizationAction {
  key: string;
  priority: number;
  expectedGain: number;
  optimizedScore: number;
}

export interface StrategicRealityOptimizationResult {
  actions: RealityOptimizationAction[];
  optimizationScore: number;
  optimizedAt: string;
}

export class StrategicRealityOptimizer {
  optimize(
    domains: readonly RealityOptimizationDomain[],
  ): StrategicRealityOptimizationResult {
    const actions = domains
      .map((domain): RealityOptimizationAction => {
        const gap = Math.max(0, domain.targetScore - domain.currentScore);
        const expectedGain = Math.max(
          0,
          Math.min(
            gap,
            Math.round(gap * 0.6 + domain.impact * 0.2 - domain.effort * 0.1),
          ),
        );

        return {
          key: `optimize-${domain.key}`,
          priority: Math.max(
            1,
            Math.min(100, Math.round(gap * 0.5 + domain.impact * 0.35)),
          ),
          expectedGain,
          optimizedScore: Math.min(100, domain.currentScore + expectedGain),
        };
      })
      .sort((a, b) => b.priority - a.priority);

    return {
      actions,
      optimizationScore:
        actions.length === 0
          ? 100
          : Math.round(
              actions.reduce((sum, action) => sum + action.optimizedScore, 0) /
                actions.length,
            ),
      optimizedAt: new Date().toISOString(),
    };
  }
}
