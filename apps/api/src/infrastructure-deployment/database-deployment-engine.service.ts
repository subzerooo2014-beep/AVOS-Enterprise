import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseDeploymentEngineService {
  evaluate(input: {
    tlsEnabled: boolean;
    connectionPoolConfigured: boolean;
    migrationsAutomated: boolean;
    backupsEnabled: boolean;
    replicationEnabled: boolean;
    pointInTimeRecovery: boolean;
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