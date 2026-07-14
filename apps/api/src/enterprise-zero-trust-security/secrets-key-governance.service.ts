import { Injectable } from '@nestjs/common';

interface SecretRecord {
  id: string;
  owner: string;
  ageDays: number;
  rotationDays: number;
  exposed: boolean;
}

@Injectable()
export class SecretsKeyGovernanceService {
  evaluate(secrets: SecretRecord[]) {
    const evaluated = secrets.map((secret) => ({
      ...secret,
      rotationRequired:
        secret.exposed || secret.ageDays >= secret.rotationDays,
      severity: secret.exposed
        ? 'critical'
        : secret.ageDays >= secret.rotationDays
          ? 'high'
          : 'low',
    }));

    return {
      secrets: evaluated,
      rotationQueue: evaluated
        .filter((secret) => secret.rotationRequired)
        .map((secret) => secret.id),
      exposedSecrets: evaluated
        .filter((secret) => secret.exposed)
        .map((secret) => secret.id),
    };
  }
}