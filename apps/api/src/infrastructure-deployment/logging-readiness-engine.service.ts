import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggingReadinessEngineService {
  evaluate(input: {
    structuredLogs: boolean;
    centralizedLogs: boolean;
    correlationIds: boolean;
    retentionConfigured: boolean;
    piiRedaction: boolean;
    auditLogsSeparated: boolean;
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