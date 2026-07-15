import { Injectable } from '@nestjs/common';
import { KubernetesWorkload } from './infrastructure-deployment.types';

@Injectable()
export class KubernetesReadinessEngineService {
  evaluate(workloads: KubernetesWorkload[]) {
    const evaluated = workloads.map((workload) => {
      const checks = [
        workload.replicas >= 2,
        workload.readinessProbe,
        workload.livenessProbe,
        workload.resourceRequests,
        workload.resourceLimits,
        workload.podDisruptionBudget,
      ];

      return {
        ...workload,
        score: Math.round(
          (checks.filter(Boolean).length / checks.length) * 100,
        ),
      };
    });

    return {
      workloads: evaluated,
      score: Math.round(
        evaluated.reduce((sum, item) => sum + item.score, 0) /
          Math.max(1, evaluated.length),
      ),
      ready: evaluated.every((item) => item.score >= 85),
    };
  }
}