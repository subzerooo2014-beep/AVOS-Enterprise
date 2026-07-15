import { Injectable } from '@nestjs/common';
import { DeploymentManifest } from './production-release.types';

@Injectable()
export class DeploymentManifestEngineService {
  validate(manifest: DeploymentManifest) {
    const checks = [
      manifest.environment === 'production',
      manifest.imageTags.length > 0,
      manifest.zeroDowntime,
      Boolean(manifest.healthEndpoint),
      Boolean(manifest.readinessEndpoint),
    ];

    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...manifest,
      score,
      ready: score === 100,
    };
  }
}