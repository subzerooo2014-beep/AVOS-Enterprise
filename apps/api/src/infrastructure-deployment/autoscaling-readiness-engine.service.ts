import { Injectable } from '@nestjs/common';

@Injectable()
export class AutoscalingReadinessEngineService {
  evaluate(input: {
    cpuScaling: boolean;
    memoryScaling: boolean;
    queueDepthScaling: boolean;
    minReplicasConfigured: boolean;
    maxReplicasConfigured: boolean;
    stabilizationWindowConfigured: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}