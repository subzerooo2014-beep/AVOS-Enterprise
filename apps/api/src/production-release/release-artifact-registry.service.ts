import { Injectable } from '@nestjs/common';
import { ReleaseArtifact } from './production-release.types';

@Injectable()
export class ReleaseArtifactRegistryService {
  validate(artifacts: ReleaseArtifact[]) {
    const required = artifacts.filter((artifact) => artifact.required);
    const missing = required.filter(
      (artifact) => !artifact.path || artifact.path.trim().length === 0,
    );

    return {
      artifacts,
      requiredCount: required.length,
      missing: missing.map((artifact) => artifact.id),
      score: Math.round(
        ((required.length - missing.length) /
          Math.max(1, required.length)) *
          100,
      ),
      ready: missing.length === 0,
    };
  }
}