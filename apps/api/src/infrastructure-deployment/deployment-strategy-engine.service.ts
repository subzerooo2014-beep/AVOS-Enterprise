import { Injectable } from '@nestjs/common';
import { DeploymentStrategy } from './infrastructure-deployment.types';

@Injectable()
export class DeploymentStrategyEngineService {
  evaluate(strategies: DeploymentStrategy[]) {
    const evaluated = strategies.map((strategy) => ({
      ...strategy,
      score: Math.round(
        ([
          strategy.zeroDowntime,
          strategy.rollbackReady,
          strategy.trafficControlReady,
        ].filter(Boolean).length /
          3) *
          100,
      ),
    }));

    return {
      strategies: evaluated,
      score: Math.round(
        evaluated.reduce((sum, item) => sum + item.score, 0) /
          Math.max(1, evaluated.length),
      ),
      ready: evaluated.some((item) => item.score === 100),
    };
  }
}