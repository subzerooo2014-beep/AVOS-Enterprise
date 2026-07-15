import { Injectable } from '@nestjs/common';

@Injectable()
export class BackupRotationEngineService {
  evaluate(input: {
    dailyBackups: boolean;
    weeklyBackups: boolean;
    monthlyBackups: boolean;
    offsiteCopies: boolean;
    encryptionEnabled: boolean;
    restoreTestsScheduled: boolean;
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