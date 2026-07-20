import { BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import {
  RealProductionCertification,
  RealProductionDomain,
  RealProductionEvidenceManifest,
} from './real-production-evidence.types';

const REQUIRED_DOMAINS: RealProductionDomain[] = [
  'database',
  'environment',
  'observability',
  'backup-recovery',
  'security',
  'performance',
  'integration',
  'deployment',
];

@Injectable()
export class RealProductionEvidenceService {
  private manifest?: RealProductionEvidenceManifest;
  private certification?: RealProductionCertification;

  importManifest(input: RealProductionEvidenceManifest) {
    if (!input || input.source !== 'real-execution') {
      throw new BadRequestException('Simulated evidence is not accepted.');
    }

    if (!input.approvedBy?.startsWith('human:')) {
      throw new BadRequestException(
        'Human Final Authority approval is mandatory.',
      );
    }

    if (!Array.isArray(input.evidence) || input.evidence.length !== 8) {
      throw new BadRequestException(
        'Exactly eight real evidence domains are required.',
      );
    }

    const domains = new Set(input.evidence.map((item) => item.domain));

    for (const requiredDomain of REQUIRED_DOMAINS) {
      if (!domains.has(requiredDomain)) {
        throw new BadRequestException(
          'Missing real evidence domain: ' + requiredDomain,
        );
      }
    }

    for (const item of input.evidence) {
      if (item.source !== 'real-execution') {
        throw new BadRequestException(
          'Evidence domain ' + item.domain + ' is not real execution evidence.',
        );
      }

      if (item.passed && item.blockers.length > 0) {
        throw new BadRequestException(
          'Evidence domain ' + item.domain + ' cannot pass with blockers.',
        );
      }
    }

    const manifestHash = createHash('sha256')
      .update(JSON.stringify({ ...input, manifestHash: undefined }))
      .digest('hex');

    this.manifest = {
      ...input,
      manifestHash,
    };

    this.certification = undefined;

    return this.manifest;
  }

  status() {
    const evidence = this.manifest?.evidence ?? [];

    const failedDomains = evidence
      .filter((item) => !item.passed || item.blockers.length > 0)
      .map((item) => item.domain);

    const verifiedDomains = evidence.filter(
      (item) => item.passed && item.blockers.length === 0,
    ).length;

    const totalDomains = REQUIRED_DOMAINS.length;
    const score = Math.round(
      (verifiedDomains / totalDomains) * 100,
    );

    return {
      name: 'AVOS Real Production Deployment & Evidence',
      version: 'RPDE-1.0.0',
      status:
        evidence.length === totalDomains &&
        failedDomains.length === 0
          ? 'real-production-ready'
          : 'blocked',
      score,
      verifiedDomains,
      totalDomains,
      failedDomains,
      manifestHash: this.manifest?.manifestHash ?? null,
      certification: this.certification ?? null,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      realEvidenceRequired: true,
      simulatedEvidenceAccepted: false,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  certify(approvedBy: string): RealProductionCertification {
    if (!approvedBy?.startsWith('human:')) {
      throw new BadRequestException(
        'Human Final Authority approval is mandatory.',
      );
    }

    if (!this.manifest?.manifestHash) {
      throw new BadRequestException(
        'A real evidence manifest must be imported first.',
      );
    }

    const state = this.status();

    const canCertify =
      state.verifiedDomains === state.totalDomains &&
      state.failedDomains.length === 0;

    this.certification = {
      id: 'real-production-certification-' + Date.now(),
      status: canCertify ? 'certified' : 'blocked',
      score: state.score,
      verifiedDomains: state.verifiedDomains,
      totalDomains: state.totalDomains,
      failedDomains: state.failedDomains,
      manifestHash: this.manifest.manifestHash,
      approvedBy: canCertify ? approvedBy : undefined,
      certifiedAt: canCertify
        ? new Date().toISOString()
        : undefined,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };

    return this.certification;
  }
}
