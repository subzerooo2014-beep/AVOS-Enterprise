import { Injectable } from '@nestjs/common';
import { ContainerDefinition } from './infrastructure-deployment.types';

@Injectable()
export class ContainerReadinessEngineService {
  evaluate(containers: ContainerDefinition[]) {
    const evaluated = containers.map((container) => {
      const checks = [
        Boolean(container.image),
        container.healthcheck,
        container.nonRootUser,
        container.readOnlyFilesystem,
        Boolean(container.cpuLimit),
        Boolean(container.memoryLimit),
      ];

      return {
        ...container,
        score: Math.round(
          (checks.filter(Boolean).length / checks.length) * 100,
        ),
      };
    });

    return {
      containers: evaluated,
      score: Math.round(
        evaluated.reduce((sum, item) => sum + item.score, 0) /
          Math.max(1, evaluated.length),
      ),
      ready: evaluated.every((item) => item.score >= 85),
    };
  }
}