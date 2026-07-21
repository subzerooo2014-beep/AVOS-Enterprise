import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'node:fs';
import { isAbsolute, join, resolve } from 'node:path';
import {
  ProductionReadinessCheck,
  ProductionReadinessStatus,
} from './production-deployment-go-live.types';

interface ArtifactDiscovery {
  exists: boolean;
  matchedPath?: string;
  candidates: string[];
}

@Injectable()
export class ProductionDeploymentRuntimeService {
  private readonly version = 'PDGL-UMP1-1.1.0';

  private readonly apiRoot = resolve(process.cwd());

  /**
   * AVOS_REPO_ROOT allows Docker, CI and other isolated runtimes to point
   * this service at the actual repository or mounted deployment metadata.
   *
   * Default local monorepo layout:
   *   <repo>/apps/api
   */
  private readonly repoRoot = this.resolveRepositoryRoot();

  private readonly evidenceRoot = join(
    this.repoRoot,
    '.avos',
    'evidence',
    'production-deployment-go-live',
  );

  constructor() {
    mkdirSync(this.evidenceRoot, { recursive: true });
  }

  getStatus(): ProductionReadinessStatus {
    const checks = this.buildChecks();
    const required = checks.filter((check) => check.required);
    const passed = required.filter((check) => check.state === 'passed').length;
    const failed = required.filter((check) => check.state === 'failed').length;
    const warnings = checks.filter((check) => check.state === 'warning').length;

    const score =
      required.length === 0
        ? 0
        : Math.round((passed / required.length) * 100);

    return {
      name: 'AVOS Production Deployment & Go-Live',
      version: this.version,
      status: failed > 0 ? 'blocked' : warnings > 0 ? 'degraded' : 'operational',
      score,
      unresolvedErrors: failed,
      unjustifiedWarnings: warnings,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      radicalErrorResolutionLaw: true,
      zeroDowntimeReady: this.discover(
        this.zeroDowntimeBlueprintCandidates(),
      ).exists,
      checks,
      generatedAt: new Date().toISOString(),
    };
  }

  getHealth(): Record<string, unknown> {
    const status = this.getStatus();

    const deploymentBlueprint = this.discover(
      this.deploymentBlueprintCandidates(),
    );
    const dockerCompose = this.discover(this.composeCandidates());
    const reverseProxy = this.discover(this.reverseProxyCandidates());
    const ciPipeline = this.discover(this.ciWorkflowCandidates());
    const backupPlan = this.discover(this.backupPolicyCandidates());
    const zeroDowntime = this.discover(
      this.zeroDowntimeBlueprintCandidates(),
    );

    return {
      name: status.name,
      version: status.version,
      state: status.status,
      score: status.score,

      repositoryRoot: this.repoRoot,
      apiRoot: this.apiRoot,

      deploymentBlueprint: deploymentBlueprint.exists,
      deploymentBlueprintPath: deploymentBlueprint.matchedPath ?? null,

      dockerCompose: dockerCompose.exists,
      dockerComposePath: dockerCompose.matchedPath ?? null,

      reverseProxy: reverseProxy.exists,
      reverseProxyPath: reverseProxy.matchedPath ?? null,

      ciPipeline: ciPipeline.exists,
      ciPipelinePath: ciPipeline.matchedPath ?? null,

      backupPlan: backupPlan.exists,
      backupPlanPath: backupPlan.matchedPath ?? null,

      zeroDowntimeReady: zeroDowntime.exists,
      zeroDowntimeBlueprintPath: zeroDowntime.matchedPath ?? null,

      unresolvedErrors: status.unresolvedErrors,
      unjustifiedWarnings: status.unjustifiedWarnings,
      checkedAt: new Date().toISOString(),
    };
  }

  private buildChecks(): ProductionReadinessCheck[] {
    const now = new Date().toISOString();

    return [
      this.discoveryCheck(
        'configuration-production-env',
        'Production environment template exists',
        this.productionEnvironmentCandidates(),
        'configuration',
        now,
      ),

      this.discoveryCheck(
        'deployment-api-container',
        'API container definition exists',
        this.apiContainerCandidates(),
        'deployment',
        now,
      ),

      this.discoveryCheck(
        'deployment-web-container',
        'Web container definition exists',
        this.webContainerCandidates(),
        'deployment',
        now,
      ),

      this.discoveryCheck(
        'deployment-compose',
        'Production compose definition exists',
        this.composeCandidates(),
        'deployment',
        now,
      ),

      this.discoveryCheck(
        'deployment-reverse-proxy',
        'Reverse proxy configuration exists',
        this.reverseProxyCandidates(),
        'deployment',
        now,
      ),

      this.discoveryCheck(
        'database-production-policy',
        'Production database policy exists',
        this.databasePolicyCandidates(),
        'database',
        now,
      ),

      this.discoveryCheck(
        'security-secrets-policy',
        'Secrets and security policy exists',
        this.securityPolicyCandidates(),
        'security',
        now,
      ),

      this.discoveryCheck(
        'observability-policy',
        'Observability policy exists',
        this.observabilityPolicyCandidates(),
        'observability',
        now,
      ),

      this.discoveryCheck(
        'recovery-backup-policy',
        'Backup and disaster recovery policy exists',
        this.backupPolicyCandidates(),
        'recovery',
        now,
      ),

      this.discoveryCheck(
        'cicd-production-workflow',
        'Production CI workflow exists',
        this.ciWorkflowCandidates(),
        'cicd',
        now,
      ),

      this.discoveryCheck(
        'go-live-checklist',
        'Go-live checklist exists',
        this.goLiveChecklistCandidates(),
        'go-live',
        now,
      ),

      this.discoveryCheck(
        'constitutional-radical-error-law',
        'Radical Error Resolution Law exists',
        this.radicalErrorLawCandidates(),
        'go-live',
        now,
      ),
    ];
  }

  private discoveryCheck(
    id: string,
    name: string,
    candidates: string[],
    category: ProductionReadinessCheck['category'],
    checkedAt: string,
  ): ProductionReadinessCheck {
    const discovery = this.discover(candidates);

    return {
      id,
      name,
      category,
      state: discovery.exists ? 'passed' : 'failed',
      required: true,
      message: discovery.exists
        ? `${name} passed using ${discovery.matchedPath}.`
        : `${name} failed. None of the supported paths exists.`,
      checkedAt,
      evidence: {
        repositoryRoot: this.repoRoot,
        matchedPath: discovery.matchedPath ?? null,
        supportedCandidates: discovery.candidates,
      },
    };
  }

  private discover(relativeOrAbsoluteCandidates: string[]): ArtifactDiscovery {
    const resolvedCandidates = relativeOrAbsoluteCandidates.map((candidate) =>
      isAbsolute(candidate)
        ? resolve(candidate)
        : resolve(this.repoRoot, candidate),
    );

    const matchedPath = resolvedCandidates.find((candidate) =>
      existsSync(candidate),
    );

    return {
      exists: Boolean(matchedPath),
      matchedPath,
      candidates: resolvedCandidates,
    };
  }

  private resolveRepositoryRoot(): string {
    const configuredRoot = process.env.AVOS_REPO_ROOT?.trim();

    if (configuredRoot) {
      return resolve(configuredRoot);
    }

    const candidates = [
      resolve(this.apiRoot, '..', '..'),
      resolve(this.apiRoot, '..'),
      this.apiRoot,
      '/workspace',
      '/app',
    ];

    const detected = candidates.find(
      (candidate) =>
        existsSync(join(candidate, 'apps', 'api')) ||
        existsSync(join(candidate, 'pnpm-workspace.yaml')) ||
        existsSync(join(candidate, 'docker-compose.production.yml')) ||
        existsSync(join(candidate, 'docker-compose.local-production.yml')),
    );

    return detected ?? resolve(this.apiRoot, '..', '..');
  }

  private productionEnvironmentCandidates(): string[] {
    return [
      '.env.production.example',
      '.env.production.template',
      '.env.production.sample',
      'deployment/production/.env.production.example',
      'deployment/configuration/.env.production.example',
    ];
  }

  private apiContainerCandidates(): string[] {
    return [
      'Dockerfile.api',
      'Dockerfile.api.production',
      'apps/api/Dockerfile',
      'apps/api/Dockerfile.production',
      'deployment/docker/Dockerfile.api',
    ];
  }

  private webContainerCandidates(): string[] {
    return [
      'Dockerfile.web',
      'Dockerfile.web.production',
      'apps/web/Dockerfile',
      'apps/web/Dockerfile.production',
      'deployment/docker/Dockerfile.web',
    ];
  }

  private composeCandidates(): string[] {
    return [
      'docker-compose.production.yml',
      'docker-compose.production.yaml',
      'docker-compose.local-production.yml',
      'docker-compose.local-production.yaml',
      'compose.production.yml',
      'compose.production.yaml',
      'deployment/docker/docker-compose.production.yml',
    ];
  }

  private reverseProxyCandidates(): string[] {
    return [
      'deployment/nginx/avos.conf',
      'deployment/nginx/nginx.conf',
      'deployment/caddy/Caddyfile',
      'Caddyfile',
      'deployment/reverse-proxy/avos.conf',
      'deployment/reverse-proxy/Caddyfile',
    ];
  }

  private databasePolicyCandidates(): string[] {
    return [
      'deployment/database/database-policy.json',
      'deployment/database/production-database-policy.json',
      'docs/operations/database-policy.json',
      'docs/policies/database-policy.json',
    ];
  }

  private securityPolicyCandidates(): string[] {
    return [
      'deployment/security/security-policy.json',
      'deployment/security/secrets-policy.json',
      'docs/security/security-policy.json',
      'docs/policies/security-policy.json',
    ];
  }

  private observabilityPolicyCandidates(): string[] {
    return [
      'deployment/observability/observability-policy.json',
      'deployment/observability/monitoring-policy.json',
      'docs/operations/observability-policy.json',
      'docs/policies/observability-policy.json',
    ];
  }

  private backupPolicyCandidates(): string[] {
    return [
      'deployment/recovery/backup-policy.json',
      'deployment/recovery/disaster-recovery-policy.json',
      'deployment/backup/backup-policy.json',
      'docs/operations/backup-policy.json',
    ];
  }

  private ciWorkflowCandidates(): string[] {
    return [
      '.github/workflows/avos-production-ci.yml',
      '.github/workflows/avos-production-ci.yaml',
      '.github/workflows/production.yml',
      '.github/workflows/production.yaml',
      '.github/workflows/deploy-production.yml',
      '.github/workflows/deploy-production.yaml',
    ];
  }

  private goLiveChecklistCandidates(): string[] {
    return [
      'deployment/production/go-live-checklist.md',
      'deployment/production/GO-LIVE-CHECKLIST.md',
      'docs/operations/go-live-checklist.md',
      'docs/production/go-live-checklist.md',
    ];
  }

  private radicalErrorLawCandidates(): string[] {
    return [
      'docs/constitution/laws/radical-error-resolution/radical-error-resolution-policy.json',
      'docs/constitution/radical-error-resolution-policy.json',
      'docs/governance/radical-error-resolution-policy.json',
    ];
  }

  private deploymentBlueprintCandidates(): string[] {
    return [
      'deployment/production/deployment-blueprint.json',
      'deployment/production/production-deployment-blueprint.json',
      'docs/architecture/production-deployment-blueprint.json',
    ];
  }

  private zeroDowntimeBlueprintCandidates(): string[] {
    return [
      'deployment/production/zero-downtime-blueprint.json',
      'deployment/production/zero-downtime-deployment.json',
      'docs/architecture/zero-downtime-blueprint.json',
    ];
  }
}
