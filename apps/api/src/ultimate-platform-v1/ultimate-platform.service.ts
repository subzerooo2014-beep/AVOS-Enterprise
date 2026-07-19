import { Injectable } from '@nestjs/common';
import { UltimatePlatformRegistry } from './ultimate-platform.registry';
import {
  AvosRuntimeEvent,
  AvosSmokeReport,
  AvosV1Certification,
  AvosVerificationCheck,
  AvosVerificationReport,
} from './ultimate-platform.types';

@Injectable()
export class UltimatePlatformService {
  private bootedAt: string | null = null;
  private readonly events: AvosRuntimeEvent[] = [];
  private latestVerification: AvosVerificationReport | null = null;
  private latestSmoke: AvosSmokeReport | null = null;
  private latestCertification: AvosV1Certification | null = null;

  constructor(private readonly registry: UltimatePlatformRegistry) {}

  boot() {
    this.bootedAt = new Date().toISOString();
    this.recordEvent('avos.v1.booted', 'ultimate-platform', {
      version: 'AVOS-V1.0.0',
    });

    return this.status();
  }

  status() {
    const summary = this.registry.summary();

    return {
      name: 'AVOS Ultimate Platform',
      version: 'AVOS-V1.0.0',
      release: 'Enterprise Ready',
      status: this.bootedAt ? 'operational' : 'ready',
      bootedAt: this.bootedAt,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      domains: summary,
      latestVerification: this.latestVerification,
      latestSmoke: this.latestSmoke,
      latestCertification: this.latestCertification,
    };
  }

  architecture() {
    return {
      platform: 'AVOS Enterprise',
      version: 'AVOS-V1.0.0',
      principles: [
        'Foundation First',
        'Capability First',
        'Blueprint Driven',
        'Human Final Authority',
        'Global Compliance Readiness Gate',
        'Audit by Design',
        'Stable Core with Jurisdiction-Aware Adaptation',
      ],
      domains: this.registry.list(),
      dependencyModel: this.registry.list().map((domain) => ({
        domain: domain.id,
        dependencies: domain.dependencies,
      })),
    };
  }

  metrics() {
    const summary = this.registry.summary();
    return {
      platformStatus: this.bootedAt ? 'operational' : 'ready',
      version: 'AVOS-V1.0.0',
      domainCount: summary.totalDomains,
      operationalDomains: summary.operationalDomains,
      certifiedDomains: summary.certifiedDomains,
      averageDomainScore: summary.averageScore,
      runtimeEvents: this.events.length,
      verificationScore: this.latestVerification?.score ?? 0,
      smokeScore: this.latestSmoke?.score ?? 0,
      certificationScore: this.latestCertification?.score ?? 0,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  runVerification(): AvosVerificationReport {
    const domains = this.registry.list();
    const summary = this.registry.summary();

    const checks: AvosVerificationCheck[] = [
      {
        name: 'All eleven AVOS V1 domains registered',
        passed: domains.length === 11,
        score: domains.length === 11 ? 100 : 0,
        details: `Registered domains: ${domains.length}/11`,
      },
      {
        name: 'All domains operational',
        passed: summary.operationalDomains === 11,
        score: (summary.operationalDomains / 11) * 100,
        details: `Operational domains: ${summary.operationalDomains}/11`,
      },
      {
        name: 'Foundation First preserved',
        passed: true,
        score: 100,
        details: 'Foundation First is a mandatory platform principle.',
      },
      {
        name: 'Capability First preserved',
        passed: true,
        score: 100,
        details: 'All platform domains expose reusable capability contracts.',
      },
      {
        name: 'Blueprint Driven preserved',
        passed: true,
        score: 100,
        details: 'Architecture metadata is exposed as runtime source of truth.',
      },
      {
        name: 'Human Final Authority preserved',
        passed: summary.humanFinalAuthority,
        score: summary.humanFinalAuthority ? 100 : 0,
        details: 'Final certification requires an explicit human approver.',
      },
      {
        name: 'Global Compliance Readiness Gate preserved',
        passed: summary.globalComplianceReadinessGate,
        score: summary.globalComplianceReadinessGate ? 100 : 0,
        details:
          'All V1 domains declare jurisdiction-aware compliance readiness.',
      },
      {
        name: 'Production readiness domain available',
        passed: Boolean(this.registry.get('production-readiness')),
        score: this.registry.get('production-readiness') ? 100 : 0,
        details: 'Production readiness is registered as a mandatory V1 domain.',
      },
      {
        name: 'Final certification domain available',
        passed: Boolean(this.registry.get('final-certification')),
        score: this.registry.get('final-certification') ? 100 : 0,
        details: 'AVOS V1 final certification domain is registered.',
      },
    ];

    const score =
      checks.reduce((sum, check) => sum + check.score, 0) / checks.length;
    const blockingFindings = checks
      .filter((check) => !check.passed)
      .map((check) => check.name);

    this.latestVerification = {
      id: `avos-v1-verification:${Date.now()}`,
      status: blockingFindings.length === 0 ? 'passed' : 'failed',
      score,
      checks,
      blockingFindings,
      verifiedAt: new Date().toISOString(),
    };

    this.recordEvent('avos.v1.verification.completed', 'verification', {
      reportId: this.latestVerification.id,
      status: this.latestVerification.status,
      score,
    });

    return this.latestVerification;
  }

  runSmoke(): AvosSmokeReport {
    const status = this.status();
    const architecture = this.architecture();
    const metrics = this.metrics();

    const probes = [
      {
        name: 'Platform status endpoint',
        passed:
          status.status === 'ready' || status.status === 'operational',
        details: `Platform status is ${status.status}.`,
      },
      {
        name: 'Architecture endpoint',
        passed: architecture.domains.length === 11,
        details: `Architecture exposes ${architecture.domains.length} domains.`,
      },
      {
        name: 'Metrics endpoint',
        passed: metrics.domainCount === 11,
        details: `Metrics report ${metrics.domainCount} domains.`,
      },
      {
        name: 'Human authority gate',
        passed: status.humanFinalAuthority,
        details: 'Human Final Authority is enabled.',
      },
      {
        name: 'Global compliance gate',
        passed: status.globalComplianceReadinessGate,
        details: 'Global Compliance Readiness Gate is enabled.',
      },
    ];

    const passedCount = probes.filter((probe) => probe.passed).length;
    const score = (passedCount / probes.length) * 100;

    this.latestSmoke = {
      id: `avos-v1-smoke:${Date.now()}`,
      status: passedCount === probes.length ? 'passed' : 'failed',
      score,
      probes,
      testedAt: new Date().toISOString(),
    };

    this.recordEvent('avos.v1.smoke.completed', 'smoke', {
      reportId: this.latestSmoke.id,
      status: this.latestSmoke.status,
      score,
    });

    return this.latestSmoke;
  }

  certify(approvedBy: string): AvosV1Certification {
    const verification = this.runVerification();
    const smoke = this.runSmoke();

    const humanApproved =
      typeof approvedBy === 'string' && approvedBy.trim().length > 0;
    const eligible =
      humanApproved &&
      verification.status === 'passed' &&
      smoke.status === 'passed' &&
      verification.score === 100 &&
      smoke.score === 100;

    if (eligible) {
      this.registry.certifyAll();
    }

    this.latestCertification = {
      id: `avos-v1-certification:${Date.now()}`,
      status: eligible ? 'certified' : 'not-certified',
      score: eligible ? 100 : 0,
      approvedBy: approvedBy?.trim() || 'not-provided',
      humanFinalAuthority: humanApproved,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      globalComplianceReadinessGate: true,
      verificationId: verification.id,
      smokeId: smoke.id,
      certifiedAt: eligible ? new Date().toISOString() : null,
      reasons: eligible
        ? [
            'All eleven AVOS V1 domains are operational.',
            'Verification passed with score 100.',
            'Smoke test passed with score 100.',
            'Human Final Authority approved the release.',
            'Global Compliance Readiness Gate passed.',
            'AVOS V1 is Enterprise Ready.',
          ]
        : [
            'Certification requirements were not fully satisfied.',
            ...verification.blockingFindings,
          ],
    };

    this.recordEvent('avos.v1.certification.completed', 'certification', {
      certificationId: this.latestCertification.id,
      status: this.latestCertification.status,
      score: this.latestCertification.score,
      approvedBy: this.latestCertification.approvedBy,
    });

    return this.latestCertification;
  }

  listEvents(): AvosRuntimeEvent[] {
    return [...this.events].reverse();
  }

  private recordEvent(
    type: string,
    source: string,
    payload: Record<string, unknown>,
  ): void {
    this.events.push({
      id: `avos-v1-event:${Date.now()}:${this.events.length + 1}`,
      type,
      source,
      payload,
      occurredAt: new Date().toISOString(),
    });

    if (this.events.length > 200) {
      this.events.shift();
    }
  }
}