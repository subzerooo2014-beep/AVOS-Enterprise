import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import {
  EvidenceDomain,
  ProductionEvidence,
} from '../domain/certification.types';
import { EvidenceCollectorPort } from '../ports/evidence-collector.port';

interface ApcpProductionConfig {
  productionMode: boolean;

  backup: {
    policyDeclared: boolean;
    recoveryPlanDeclared: boolean;
    provider?: string;
    retentionDays?: number;
  };

  security: {
    secretsExternalized: boolean;
    runtimeSecretReference?: string;
    secretFingerprint?: string;
  };

  deployment: {
    deploymentId: string;
    releaseVersion: string;
    environment: string;
  };
}

@Injectable()
export class LocalEvidenceCollector implements EvidenceCollectorPort {
  async collect(
    platformId: string,
    domains: EvidenceDomain[],
  ): Promise<ProductionEvidence[]> {
    const observedAt = new Date().toISOString();
    const productionConfig = this.loadProductionConfig();

    return domains.map((domain) => {
      const metadata = this.collectDomainMetadata(
        domain,
        productionConfig,
      );

      const checksum = createHash('sha256')
        .update(
          JSON.stringify({
            platformId,
            domain,
            observedAt,
            metadata,
          }),
        )
        .digest('hex');

      return {
        id: `evidence-${domain}-${Date.now()}`,
        platformId,
        domain,
        state: this.isVerified(metadata)
          ? 'verified'
          : 'failed',
        source: 'local-runtime-adapter',
        observedAt,
        checksum,
        metadata,
        simulated: false,
      };
    });
  }

  private collectDomainMetadata(
    domain: EvidenceDomain,
    config: ApcpProductionConfig,
  ): Record<string, unknown> {
    switch (domain) {
      case 'database':
        return {
          configured: Boolean(process.env.DATABASE_URL),
          provider: process.env.DATABASE_URL
            ? 'configured'
            : 'not-configured',
        };

      case 'environment':
        return {
          productionMode: config.productionMode,
          runtimeMode: process.env.NODE_ENV ?? 'development',
          nodeVersion: process.version,
          platform: process.platform,
        };

      case 'observability':
        return {
          runtimeMetricsAvailable:
            typeof process.memoryUsage === 'function',
          uptimeSeconds: process.uptime(),
        };

      case 'backup-recovery':
        return {
          policyDeclared:
            config.backup.policyDeclared === true,
          recoveryPlanDeclared:
            config.backup.recoveryPlanDeclared === true,
          provider:
            config.backup.provider ?? 'not-configured',
          retentionDays:
            config.backup.retentionDays ?? 0,
        };

      case 'security':
        return {
          secretsExternalized:
            config.security.secretsExternalized === true,
          productionMode:
            config.productionMode === true,
          runtimeSecretReference:
            config.security.runtimeSecretReference ??
            'not-configured',
          secretFingerprintPresent:
            Boolean(config.security.secretFingerprint),
        };

      case 'performance':
        return {
          rssBytes: process.memoryUsage().rss,
          heapUsedBytes: process.memoryUsage().heapUsed,
          uptimeSeconds: process.uptime(),
        };

      case 'integration':
        return {
          apiRuntime: true,
          adapterBoundary: true,
        };

      case 'deployment':
        return {
          deploymentId:
            config.deployment.deploymentId,
          releaseVersion:
            config.deployment.releaseVersion,
          environment:
            config.deployment.environment,
          productionMode:
            config.productionMode,
        };
    }
  }

  private loadProductionConfig(): ApcpProductionConfig {
    const candidates = [
      resolve(process.cwd(), 'config', 'apcp-production.json'),
      resolve(
        process.cwd(),
        'apps',
        'api',
        'config',
        'apcp-production.json',
      ),
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        'config',
        'apcp-production.json',
      ),
      resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'config',
        'apcp-production.json',
      ),
    ];

    const configPath = candidates.find((candidate) =>
      existsSync(candidate),
    );

    if (!configPath) {
      throw new Error(
        'APCP production configuration file was not found.',
      );
    }

    const rawContent = readFileSync(configPath, 'utf8')
      .replace(/^\uFEFF/, '');

    const parsed = JSON.parse(
      rawContent,
    ) as Partial<ApcpProductionConfig>;

    this.validateProductionConfig(parsed);

    return parsed as ApcpProductionConfig;
  }

  private validateProductionConfig(
    config: Partial<ApcpProductionConfig>,
  ): void {
    if (config.productionMode !== true) {
      throw new Error(
        'APCP productionMode must be true.',
      );
    }

    if (
      config.backup?.policyDeclared !== true ||
      config.backup?.recoveryPlanDeclared !== true
    ) {
      throw new Error(
        'APCP backup and recovery declarations are incomplete.',
      );
    }

    if (
      config.security?.secretsExternalized !== true ||
      !config.security.secretFingerprint
    ) {
      throw new Error(
        'APCP production security configuration is incomplete.',
      );
    }

    if (
      !config.deployment?.deploymentId ||
      !config.deployment.releaseVersion ||
      config.deployment.environment !== 'production'
    ) {
      throw new Error(
        'APCP deployment configuration is incomplete.',
      );
    }
  }

  private isVerified(
    metadata: Record<string, unknown>,
  ): boolean {
    return !Object.values(metadata).some(
      (value) =>
        value === false ||
        value === '' ||
        value === null ||
        value === undefined ||
        value === 'not-configured' ||
        value === 0,
    );
  }
}
