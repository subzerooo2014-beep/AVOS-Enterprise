import { Injectable } from '@nestjs/common';
import { RollbackManifest } from './production-release.types';

@Injectable()
export class RollbackManifestEngineService {
  evaluate(manifest: RollbackManifest) {
    const checks = [
      manifest.databaseRollbackReady,
      manifest.applicationRollbackReady,
      manifest.configurationRollbackReady,
      manifest.artifactRollbackReady,
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