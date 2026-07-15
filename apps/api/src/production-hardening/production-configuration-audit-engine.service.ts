import { Injectable } from '@nestjs/common';
import { ProductionConfiguration } from './production-hardening.types';

@Injectable()
export class ProductionConfigurationAuditEngineService {
  audit(configuration: ProductionConfiguration) {
    const checks = [
      configuration.environment === 'production',
      configuration.httpsEnabled,
      configuration.corsRestricted,
      configuration.rateLimitingEnabled,
      configuration.secretsExternalized,
      configuration.databaseTlsEnabled,
      configuration.cacheEnabled,
      configuration.queueEnabled,
    ];

    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      configuration,
      score,
      passed: score === 100,
    };
  }
}