import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { StartupValidationResult } from '../contracts/integration.contracts';
import { RuntimePersistenceService } from '../persistence/runtime-persistence.service';

@Injectable()
export class RuntimeStartupValidationService {
  constructor(
    private readonly persistence: RuntimePersistenceService,
  ) {}

  async validate(): Promise<StartupValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const checks: StartupValidationResult['checks'] = [];

    const runtimeManifest = join(
      process.cwd(),
      'src',
      'avos-enterprise-runtime',
      'runtime.manifest.json',
    );

    const runtimeManifestExists = existsSync(runtimeManifest);
    checks.push({
      name: 'runtime-manifest',
      success: runtimeManifestExists,
      details: { path: runtimeManifest },
    });

    if (!runtimeManifestExists) {
      errors.push('Runtime manifest is missing');
    }

    const futureManifest = join(
      process.cwd(),
      'src',
      'avos-future-platform',
      'future-platform.manifest.json',
    );

    const futureManifestExists = existsSync(futureManifest);
    checks.push({
      name: 'future-platform-manifest',
      success: futureManifestExists,
      details: { path: futureManifest },
    });

    if (!futureManifestExists) {
      errors.push('Future platform manifest is missing');
    }

    const databaseUrlPresent = Boolean(process.env.DATABASE_URL);
    checks.push({
      name: 'database-url',
      success: databaseUrlPresent,
    });

    if (!databaseUrlPresent) {
      warnings.push(
        'DATABASE_URL is not configured; memory persistence may be used',
      );
    }

    const persistenceHealth = await this.persistence.health();
    checks.push({
      name: 'runtime-persistence',
      success: persistenceHealth.healthy,
      details: persistenceHealth.details,
    });

    if (!persistenceHealth.healthy) {
      errors.push('Runtime persistence is unhealthy');
    }

    return {
      success: errors.length === 0,
      checkedAt: new Date().toISOString(),
      errors,
      warnings,
      checks,
    };
  }
}