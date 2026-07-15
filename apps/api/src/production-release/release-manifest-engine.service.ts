import { Injectable } from '@nestjs/common';
import { ReleaseManifest } from './production-release.types';

@Injectable()
export class ReleaseManifestEngineService {
  evaluate(
    input: Omit<ReleaseManifest, 'status'>,
  ): ReleaseManifest {
    const ready =
      input.buildPassed &&
      input.typescriptPassed &&
      input.flutterAnalyzePassed &&
      input.smokePassed &&
      input.integrationPassed &&
      input.verificationPassed &&
      input.certificationPassed;

    return {
      ...input,
      status: ready ? 'ready' : 'rejected',
    };
  }

  release(manifest: ReleaseManifest): ReleaseManifest {
    if (manifest.status !== 'ready') {
      throw new Error('Release manifest is not ready');
    }

    return {
      ...manifest,
      status: 'released',
    };
  }
}