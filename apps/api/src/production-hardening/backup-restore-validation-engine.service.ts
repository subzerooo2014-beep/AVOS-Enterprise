import { Injectable } from '@nestjs/common';

@Injectable()
export class BackupRestoreValidationEngineService {
  validate(input: {
    backupCreated: boolean;
    backupEncrypted: boolean;
    checksumVerified: boolean;
    restoreExecuted: boolean;
    restoredDataValidated: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      passed: score === 100,
    };
  }
}