import { Injectable } from '@nestjs/common';

@Injectable()
export class ReleaseTagReadinessEngineService {
  evaluate(input: {
    version: string;
    manifestReady: boolean;
    certificateReady: boolean;
    releaseNotesReady: boolean;
    gitClean: boolean;
  }) {
    const validVersion = /^\d+\.\d+\.\d+$/.test(input.version);
    const checks = [
      validVersion,
      input.manifestReady,
      input.certificateReady,
      input.releaseNotesReady,
      input.gitClean,
    ];

    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      validVersion,
      score,
      ready: score === 100,
      tag: `v${input.version}`,
    };
  }
}