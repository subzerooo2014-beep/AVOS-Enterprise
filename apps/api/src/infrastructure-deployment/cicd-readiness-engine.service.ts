import { Injectable } from '@nestjs/common';
import { DeploymentPipeline } from './infrastructure-deployment.types';

@Injectable()
export class CicdReadinessEngineService {
  evaluate(pipelines: DeploymentPipeline[]) {
    const evaluated = pipelines.map((pipeline) => {
      const checks = [
        pipeline.build,
        pipeline.test,
        pipeline.securityScan,
        pipeline.artifactPublish,
        pipeline.stagingDeploy,
        pipeline.productionApproval,
        pipeline.productionDeploy,
        pipeline.rollback,
      ];

      return {
        ...pipeline,
        score: Math.round(
          (checks.filter(Boolean).length / checks.length) * 100,
        ),
      };
    });

    return {
      pipelines: evaluated,
      score: Math.round(
        evaluated.reduce((sum, item) => sum + item.score, 0) /
          Math.max(1, evaluated.length),
      ),
      ready: evaluated.every((item) => item.score === 100),
    };
  }
}